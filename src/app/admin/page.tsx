"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiScheduleDescriptionAssistant } from '@/ai/flows/ai-schedule-description-assistant';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';
import { CATEGORIES, DAYS } from '@/lib/schedule-data';

export default function AdminPortal() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activityName: '',
    category: '',
    targetAudience: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    additionalDetails: '',
  });
  const [generatedDescription, setGeneratedDescription] = useState('');

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
        description: "Please fill in the basic activity details first.",
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
        title: "Description Generated",
        description: "AI assistant has created a draft for you.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate description at this time.",
      });
    } finally {
      setLoading(false);
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
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-border p-2">
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/5 text-primary font-bold">
                  <PlusCircle className="h-5 w-5" /> Add Activity
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                  <Settings className="h-5 w-5" /> Hub Settings
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-none shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Add New Schedule Activity</CardTitle>
                <CardDescription>
                  Create a new entry for the live weekly schedule. Use the AI assistant to help with copywriting.
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
                    <Select onValueChange={(val) => handleSelectChange('category', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input 
                      id="targetAudience" 
                      name="targetAudience" 
                      placeholder="e.g. Adults 50+" 
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select onValueChange={(val) => handleSelectChange('dayOfWeek', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      name="startTime" 
                      type="time" 
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      name="endTime" 
                      type="time" 
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalDetails">Additional USP / Details (for AI Assistant)</Label>
                  <Textarea 
                    id="additionalDetails" 
                    name="additionalDetails" 
                    placeholder="e.g. Focuses on breathing, quiet music played, beginner friendly..."
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
                        Generate with AI Assistant
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Write your own description or use the AI assistant above..." 
                      className="min-h-[120px]"
                      value={generatedDescription}
                      onChange={(e) => setGeneratedDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <Button size="lg" className="px-12 bg-primary hover:bg-primary/90">
                    Publish to Live Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}