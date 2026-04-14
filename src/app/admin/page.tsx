
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutDashboard, LogOut, Inbox, User, Mail, Phone, Clock, Calendar, ShieldAlert, Key, LogIn, FileText, CheckCircle2, MoreVertical, ArrowRight, XCircle, Clock3, LayoutGrid, List, MapPin, Users, ChevronDown, ChevronUp, ShieldCheck, UserPlus, Trash2 } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase, useDoc, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STATUS_COLUMNS = [
  { id: 'Pending', label: 'Pending', color: 'bg-amber-500', icon: Clock3 },
  { id: 'Reviewed', label: 'Reviewed', color: 'bg-blue-500', icon: FileText },
  { id: 'Confirmed', label: 'Confirmed', color: 'bg-green-500', icon: CheckCircle2 },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-500', icon: XCircle },
];

const PRIMARY_ADMIN_EMAIL = 'bishopshullhub@gmail.com';

export default function AdminPortal() {
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading } = useFirebase();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [activeTab, setActiveTab] = useState('enquiries');
  
  // Status check for Admin role in Firestore
  const adminDocRef = useMemoFirebase(() => {
    return user && !user.isAnonymous ? doc(firestore, 'admins', user.uid) : null;
  }, [firestore, user]);
  
  const { data: adminRecord, isLoading: checkingAdmin } = useDoc(adminDocRef);

  // Determine if user has admin access (either via record or primary email)
  const hasAdminAccess = useMemo(() => {
    if (!user) return false;
    return !!adminRecord || user.email === PRIMARY_ADMIN_EMAIL;
  }, [adminRecord, user]);

  // Enquiries Query - Strictly gate behind access check
  const enquiriesQuery = useMemoFirebase(() => {
    if (!hasAdminAccess) return null;
    return query(collection(firestore, 'booking_enquiries'), orderBy('submissionDateTime', 'desc'));
  }, [firestore, hasAdminAccess]);
  
  const { data: enquiries, isLoading: loadingEnquiries } = useCollection(enquiriesQuery);

  // Security Team Query - Strictly gate behind access check
  const securityQuery = useMemoFirebase(() => {
    if (!hasAdminAccess) return null;
    return query(collection(firestore, 'security_team'), orderBy('addedAt', 'desc'));
  }, [firestore, hasAdminAccess]);

  const { data: securityContacts, isLoading: loadingSecurity } = useCollection(securityQuery);

  // Calculate upcoming bookings
  const upcomingBookings = useMemo(() => {
    if (!enquiries) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    return enquiries
      .filter(e => {
        if (e.status !== 'Confirmed') return false;
        const bookingDate = new Date(e.dateRequired);
        return bookingDate >= today && bookingDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dateRequired).getTime() - new Date(b.dateRequired).getTime());
  }, [enquiries]);

  const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const docRef = doc(firestore, 'booking_enquiries', enquiryId);
      await updateDoc(docRef, { status: newStatus });
      toast({ title: "Status Updated", description: `Enquiry set to ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Permissions or connection error." });
    }
  };

  const handleAddSecurityContact = (name: string, email: string) => {
    const contactId = Math.random().toString(36).substring(7);
    const docRef = doc(firestore, 'security_team', contactId);
    setDocumentNonBlocking(docRef, {
      id: contactId,
      name,
      email,
      addedAt: new Date().toISOString()
    }, {});
    toast({ title: "Contact Added", description: `${name} has been added to the Security Team.` });
  };

  const handleDeleteSecurityContact = (contactId: string) => {
    const docRef = doc(firestore, 'security_team', contactId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Contact Removed", description: "Team member has been removed." });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCopyUID = async (uid: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(uid);
        toast({ title: "Copied", description: "UID copied to clipboard." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Please manually copy the ID below." });
    }
  };

  if (isUserLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Verifying Administrative Status...</p>
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-4 bg-primary/10 text-primary rounded-full w-fit">
              <User className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl font-headline text-primary">Login Required</CardTitle>
            <CardDescription>
              You must be logged in with an authorized account to access the Hub Admin Portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild className="w-full gap-2">
              <Link href="/login"><LogIn className="h-4 w-4" /> Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-4 bg-amber-100 text-amber-600 rounded-full w-fit">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl font-headline text-primary">Access Restricted</CardTitle>
            <CardDescription>
              Your account ({user.email}) does not have administrative privileges yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  <Key className="h-4 w-4" /> Your Unique ID
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCopyUID(user.uid)} className="h-6 text-[10px] uppercase font-bold">Copy</Button>
              </div>
              <code className="block bg-white p-3 rounded border border-border text-xs break-all font-mono">
                {user.uid}
              </code>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleLogout} variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Return to Public Site</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Logged in as {user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" className="gap-2 shadow-sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 shadow-sm w-fit">
            <TabsTrigger value="enquiries" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white">
              <Inbox className="h-4 w-4 mr-2" /> Booking Enquiries
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShieldCheck className="h-4 w-4 mr-2" /> Security Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries" className="space-y-8 animate-in fade-in duration-500">
            {/* Upcoming Bookings Display (Next 7 Days) */}
            {!loadingEnquiries && upcomingBookings.length > 0 && (
              <section className="animate-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-headline font-bold text-primary">Upcoming Bookings (Next 7 Days)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-green-500 shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="text-[9px] uppercase font-bold">{booking.dateRequired}</Badge>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[9px] uppercase font-bold">Confirmed</Badge>
                        </div>
                        <h3 className="font-bold text-primary line-clamp-1">{booking.name}</h3>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {booking.startTime} - {booking.endTime}
                          </div>
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            {booking.typeOfEvent}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-headline font-bold text-primary">All Enquiries</h2>
              </div>
              <div className="bg-white rounded-lg p-1 border shadow-sm flex items-center">
                <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="gap-2">
                  <LayoutGrid className="h-4 w-4" /> Kanban
                </Button>
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="gap-2">
                  <List className="h-4 w-4" /> List
                </Button>
              </div>
            </div>

            {loadingEnquiries ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border shadow-sm">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading enquiries...</p>
              </div>
            ) : enquiries && enquiries.length > 0 ? (
              <>
                {viewMode === 'kanban' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {STATUS_COLUMNS.map((column) => {
                      const columnEnquiries = enquiries.filter(e => (e.status || 'Pending') === column.id);
                      return (
                        <div key={column.id} className="flex flex-col gap-4 min-h-[500px]">
                          <div className="flex items-center gap-2 px-2">
                            <div className={cn("w-2 h-2 rounded-full", column.color)} />
                            <h3 className="font-bold text-primary font-headline">{column.label}</h3>
                            <Badge variant="secondary" className="ml-1">{columnEnquiries.length}</Badge>
                          </div>
                          <div className="flex flex-col gap-4 bg-muted/20 p-3 rounded-2xl min-h-[400px] border-2 border-dashed border-muted">
                            {columnEnquiries.map((enquiry) => (
                              <KanbanCard key={enquiry.id} enquiry={enquiry} onUpdateStatus={handleUpdateStatus} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <Card key={enquiry.id} className="border-none shadow-md bg-white overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-white font-mono text-[10px] uppercase">ID: {enquiry.id}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(enquiry.submissionDateTime).toLocaleString()}</span>
                          </div>
                          <Badge className={
                            enquiry.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                            enquiry.status === 'Confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                            enquiry.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                            'bg-blue-100 text-blue-700 hover:bg-blue-100'
                          }>
                            {enquiry.status || 'Pending'}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-primary font-bold"><User className="h-4 w-4" /><span>{enquiry.name}</span></div>
                              <div className="text-sm text-muted-foreground"><Mail className="h-3 w-3 inline mr-1" /> {enquiry.emailAddress} | <Phone className="h-3 w-3 inline mr-1" /> {enquiry.phoneNumber}</div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-primary font-bold"><Calendar className="h-4 w-4" /><span>{enquiry.typeOfEvent}</span></div>
                              <div className="text-sm text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" /> {enquiry.dateRequired} | {enquiry.startTime} - {enquiry.endTime}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-muted-foreground">No enquiries found.</div>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <Card className="flex-1 border-none shadow-xl bg-white h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <UserPlus className="h-5 w-5" /> Add New Security Contact
                  </CardTitle>
                  <CardDescription>Enter details to add a member to the Security Team mailing list.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddSecurityContact(formData.get('name') as string, formData.get('email') as string);
                    (e.target as HTMLFormElement).reset();
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Full Name</Label>
                        <Input id="contact-name" name="name" placeholder="e.g. Paul Smith" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address</Label>
                        <Input id="contact-email" name="email" type="email" placeholder="paul@example.com" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full md:w-fit gap-2">
                      <UserPlus className="h-4 w-4" /> Add to List
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="flex-[2] border-none shadow-xl bg-white min-h-[400px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="h-5 w-5" /> Current Security Team
                  </CardTitle>
                  <CardDescription>Members listed here receive security-related notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSecurity ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : securityContacts && securityContacts.length > 0 ? (
                    <div className="space-y-3">
                      {securityContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-primary">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteSecurityContact(contact.id)}
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed flex flex-col items-center gap-3">
                      <ShieldCheck className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm text-muted-foreground">No security contacts added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function KanbanCard({ enquiry, onUpdateStatus }: { enquiry: any, onUpdateStatus: (id: string, s: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(enquiry.submissionDateTime);
  
  return (
    <Card 
      className={cn(
        "border shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group cursor-pointer",
        isExpanded ? "ring-2 ring-primary" : ""
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">ID: {enquiry.id.substring(0, 6)}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Pending'); }} className="gap-2">
                <Clock3 className="h-3 w-3 text-amber-500" /> Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Reviewed'); }} className="gap-2">
                <FileText className="h-3 w-3 text-blue-500" /> Mark as Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Confirmed'); }} className="gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" /> Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Rejected'); }} className="gap-2">
                <XCircle className="h-3 w-3 text-red-500" /> Mark as Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-primary line-clamp-1">{enquiry.name}</h4>
            {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" /> {enquiry.dateRequired}
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-2 space-y-1">
          <p className="text-[10px] font-bold text-primary flex items-center gap-1">
             {enquiry.typeOfEvent}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {enquiry.startTime} - {enquiry.endTime}
          </p>
        </div>

        {isExpanded && (
           <div className="pt-2 border-t mt-2 space-y-3 animate-in fade-in slide-in-from-top-1">
              <div className="grid grid-cols-1 gap-2 text-[10px]">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3" /> {enquiry.emailAddress}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3" /> {enquiry.phoneNumber}</div>
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-3 w-3 mt-0.5" /> <span>{enquiry.postalAddress}, {enquiry.postcode}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-3 w-3" /> Attendance: {enquiry.estimatedAttendance}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-3 w-3" /> Contact: {enquiry.preferredContact}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3 w-3" /> Submitted: {date.toLocaleString()}</div>
              </div>
              {enquiry.additionalRequirements && enquiry.additionalRequirements !== "None provided" && (
                <div className="bg-amber-50 p-2 rounded text-[10px] space-y-1 border border-amber-100">
                  <p className="font-bold text-amber-800">Additional Requirements:</p>
                  <p className="italic text-amber-900">"{enquiry.additionalRequirements}"</p>
                </div>
              )}
           </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t bg-muted/10 flex justify-between items-center">
        <span className="text-[9px] text-muted-foreground font-medium uppercase">{date.toLocaleDateString()}</span>
        <div className="flex gap-1">
          {enquiry.status !== 'Confirmed' && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600" onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Confirmed'); }}>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {enquiry.status === 'Pending' && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600" onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, 'Reviewed'); }}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
