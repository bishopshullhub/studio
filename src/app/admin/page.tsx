
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiScheduleDescriptionAssistant } from '@/ai/flows/ai-schedule-description-assistant';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, LayoutDashboard, PlusCircle, Settings, LogOut, CheckCircle, Inbox, Calendar, User, Mail, Phone, Clock, FileText } from 'lucide-react';
import { CATEGORIES, DAYS } from '@/lib/schedule-data';
import { useFirebase, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPortal() {
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('add-activity');
  
  const [formData, setFormData] = useState({
    activityName: '',
    category: '',
    targetAudience: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    additionalDetails: '',
    contactInfo: '',
    frequency: 'Weekly',
  });
  const [generatedDescription, setGeneratedDescription] = useState('');

  // Fetch Enquiries
  const enquiriesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'booking_enquiries'), orderBy('submissionDateTime', 'desc'));
  }, [firestore]);
  
  const { data: enquiries, isLoading: loadingEnquiries } = useCollection(enquiriesQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.activityName || !formData.category || !formData.dayOfWeek) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in the activity name, category, and day first.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await aiScheduleDescriptionAssistant({
        activityName: formData.activityName,
        category: formData.category,
        targetAudience: formData.targetAudience || 'All ages',
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime || '00:00',
        endTime: formData.endTime || '00:00',
        additionalDetails: formData.additionalDetails
      });
      setGeneratedDescription(result.description);
      toast({
        title: "AI Copy Generated",
        description: "Review and refine the draft below.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI assistant is temporarily unavailable.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.activityName || !generatedDescription || !formData.dayOfWeek) {
      toast({
        variant: "destructive",
        title: "Cannot Publish",
        description: "Ensure name, day, and description are all present.",
      });
      return;
    }

    setPublishing(true);
    try {
      const scheduleId = Math.random().toString(36).substring(7);
      const docRef = doc(firestore, 'weekly_schedules', scheduleId);
      
      const newActivity = {
        id: scheduleId,
        activityName: formData.activityName,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime || '00:00',
        endTime: formData.endTime || '00:00',
        category: formData.category,
        description: generatedDescription,
        contactInfo: formData.contactInfo || 'info@bhhub.co.uk',
        frequency: formData.frequency,
      };

      setDocumentNonBlocking(docRef, newActivity, {});
      
      toast({
        title: "Activity Published",
        description: `${formData.activityName} is now live on the schedule.`,
      });

      setFormData({
        activityName: '',
        category: '',
        targetAudience: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        additionalDetails: '',
        contactInfo: '',
        frequency: 'Weekly',
      });
      setGeneratedDescription('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Publish Failed",
        description: "Check your internet connection and permissions.",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">Admin Portal</h1>
          </div>
          <Button variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-border p-2">
              <nav className="space-y-1">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start gap-3 ${activeTab === 'add-activity' ? 'bg-primary/5 text-primary font-bold' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('add-activity')}
                >
                  <PlusCircle className="h-5 w-5" /> Add Activity
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start gap-3 ${activeTab === 'enquiries' ? 'bg-primary/5 text-primary font-bold' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('enquiries')}
                >
                  <Inbox className="h-5 w-5" /> Enquiry Inbox
                  {enquiries && enquiries.length > 0 && (
                    <Badge className="ml-auto bg-primary text-white">{enquiries.length}</Badge>
                  )}
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                  <Settings className="h-5 w-5" /> Hub Settings
                </Button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'add-activity' ? (
              <Card className="border-none shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-primary">Schedule New Activity</CardTitle>
                  <CardDescription>
                    Populate the Hub's live timetable. Use the AI tool to draft professional copy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activityName">Activity Name</Label>
                      <Input 
                        id="activityName" 
                        name="activityName" 
                        placeholder="e.g. Tai Chi for Beginners" 
                        value={formData.activityName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Contact Info (Email/Web)</Label>
                      <Input 
                        id="contactInfo" 
                        name="contactInfo" 
                        placeholder="e.g. instructor@example.com" 
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={formData.frequency} onValueChange={(val) => handleSelectChange('frequency', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="First Saturday of Month">First Saturday of Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select value={formData.dayOfWeek} onValueChange={(val) => handleSelectChange('dayOfWeek', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start</Label>
                        <Input id="startTime" name="startTime" type="time" step="900" value={formData.startTime} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End</Label>
                        <Input id="endTime" name="endTime" type="time" step="900" value={formData.endTime} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalDetails">Bullet Points for AI Assistant</Label>
                    <Textarea 
                      id="additionalDetails" 
                      name="additionalDetails" 
                      placeholder="e.g. Beginner friendly, please bring a mat, £5 per session..."
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pt-6 border-t border-muted">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">Activity Description</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 text-primary border-primary hover:bg-primary/5"
                          onClick={handleGenerateDescription}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                          Generate with AI
                        </Button>
                      </div>
                      <Textarea 
                        placeholder="AI will generate text here, or you can write manually..." 
                        className="min-h-[120px]"
                        value={generatedDescription}
                        onChange={(e) => setGeneratedDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8">
                    <Button 
                      size="lg" 
                      className="px-12 bg-primary hover:bg-primary/90 gap-2"
                      disabled={publishing}
                      onClick={handlePublish}
                    >
                      {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Publish to Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-headline font-bold text-primary">Booking Enquiry Inbox</h2>
                  <p className="text-sm text-muted-foreground">{enquiries?.length || 0} total submissions</p>
                </div>
                
                {loadingEnquiries ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border shadow-sm">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading enquiries...</p>
                  </div>
                ) : enquiries && enquiries.length > 0 ? (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <Card key={enquiry.id} className="border-none shadow-md bg-white overflow-hidden group">
                        <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-white font-mono text-[10px] uppercase">ID: {enquiry.id}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(enquiry.submissionDateTime).toLocaleString()}</span>
                          </div>
                          <Badge className={
                            enquiry.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                            enquiry.status === 'Confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                            'bg-blue-100 text-blue-700 hover:bg-blue-100'
                          }>
                            {enquiry.status}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-primary font-bold">
                                <User className="h-4 w-4" />
                                <span>{enquiry.name}</span>
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-3 w-3" /> {enquiry.emailAddress}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-3 w-3" /> {enquiry.phoneNumber}
                                </div>
                                <div className="mt-2 p-3 bg-muted/30 rounded-lg text-xs">
                                  {enquiry.postalAddress}, {enquiry.postcode}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-primary font-bold">
                                <Calendar className="h-4 w-4" />
                                <span>{enquiry.typeOfEvent}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" /> {enquiry.dateRequired}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-3 w-3" /> {enquiry.startTime} - {enquiry.endTime}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <FileText className="h-3 w-3" /> {enquiry.estimatedAttendance} guests
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-muted">
                            <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Requirements / Notes</p>
                            <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed italic">
                              {enquiry.additionalRequirements || "None provided"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-center space-y-4">
                    <Inbox className="h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-bold text-muted-foreground">Your inbox is empty</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">New booking enquiries from the Hub website will appear here automatically.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
