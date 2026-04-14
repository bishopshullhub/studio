
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutDashboard, LogOut, Inbox, User, Mail, Phone, Clock, Calendar, ShieldAlert, Key, LogIn, FileText, CheckCircle2, MoreVertical, ArrowRight, XCircle, Clock3, LayoutGrid, List, MapPin, Users, ChevronDown, ChevronUp, ShieldCheck, UserPlus, Trash2, Send, AlertCircle, Info } from 'lucide-react';
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
import { sendSecurityReviewEmailAction } from '@/app/actions/send-email';
import { format, isWithinInterval, addDays, startOfToday, parseISO } from 'date-fns';

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
  
  const adminDocRef = useMemoFirebase(() => {
    return user && !user.isAnonymous ? doc(firestore, 'admins', user.uid) : null;
  }, [firestore, user]);
  
  const { data: adminRecord, isLoading: checkingAdmin } = useDoc(adminDocRef);

  const hasAdminAccess = useMemo(() => {
    if (!user) return false;
    return !!adminRecord || user.email === PRIMARY_ADMIN_EMAIL;
  }, [adminRecord, user]);

  const enquiriesQuery = useMemoFirebase(() => {
    if (!hasAdminAccess) return null;
    return query(collection(firestore, 'booking_enquiries'), orderBy('submissionDateTime', 'desc'));
  }, [firestore, hasAdminAccess]);
  
  const { data: enquiries, isLoading: loadingEnquiries } = useCollection(enquiriesQuery);

  const securityQuery = useMemoFirebase(() => {
    if (!hasAdminAccess) return null;
    return query(collection(firestore, 'security_team'), orderBy('addedAt', 'desc'));
  }, [firestore, hasAdminAccess]);

  const { data: securityContacts, isLoading: loadingSecurity } = useCollection(securityQuery);

  const upcomingBookings = useMemo(() => {
    if (!enquiries) return [];
    const today = startOfToday();
    const nextWeek = addDays(today, 7);
    return enquiries.filter(e => {
      if (e.status !== 'Confirmed') return false;
      try {
        const eventDate = parseISO(e.dateRequired);
        return isWithinInterval(eventDate, { start: today, end: nextWeek });
      } catch {
        return false;
      }
    }).sort((a, b) => a.dateRequired.localeCompare(b.dateRequired));
  }, [enquiries]);

  const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const docRef = doc(firestore, 'booking_enquiries', enquiryId);
      await updateDoc(docRef, { status: newStatus });
      toast({ title: "Status Updated", description: `Enquiry set to ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Permissions error." });
    }
  };

  const handleSendToSecurity = async (enquiry: any) => {
    if (!securityContacts || securityContacts.length === 0) {
      toast({ variant: "destructive", title: "Missing Contacts", description: "Please add security contacts in the Security Team tab first." });
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const result = await sendSecurityReviewEmailAction(enquiry, securityContacts, baseUrl);
      if (result.success) {
        toast({ title: "Review Sent", description: "Security Team has been notified." });
      } else {
        toast({ variant: "destructive", title: "Send Failed", description: result.error || "Could not dispatch emails." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Send Failed", description: err.message || "An unexpected error occurred." });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isUserLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Verifying Admin Status...</p>
      </div>
    );
  }

  if (!user || user.isAnonymous || !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto p-4 bg-amber-100 text-amber-600 rounded-full w-fit">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Login as Admin to access this portal.</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full"><Link href="/login">Go to Login</Link></Button>
            <Button asChild variant="ghost" className="w-full"><Link href="/">Home</Link></Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"><LayoutDashboard className="h-6 w-6" /></div>
            <h1 className="text-3xl font-headline font-bold text-primary">Admin Portal</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" /> Sign Out</Button>
        </div>

        {/* Upcoming Bookings Summary */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-headline font-bold text-primary">Upcoming Bookings (Next 7 Days)</h2>
          </div>
          {upcomingBookings.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {upcomingBookings.map(e => (
                <Card key={e.id} className="min-w-[280px] bg-white border-none shadow-md">
                  <CardHeader className="p-4 pb-0">
                    <Badge variant="secondary" className="w-fit mb-2">{format(parseISO(e.dateRequired), 'EEEE, MMM do')}</Badge>
                    <CardTitle className="text-sm font-bold truncate">{e.typeOfEvent}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {e.startTime}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {e.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white/50 border border-dashed rounded-2xl p-6 text-center text-muted-foreground text-sm">
              No confirmed bookings in the next 7 days.
            </div>
          )}
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

          <TabsContent value="enquiries" className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-headline font-bold text-primary">Workflow Management</h2>
              <div className="bg-white rounded-lg p-1 border shadow-sm flex items-center">
                <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')}><LayoutGrid className="h-4 w-4 mr-2" /> Kanban</Button>
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}><List className="h-4 w-4 mr-2" /> List</Button>
              </div>
            </div>

            {loadingEnquiries ? (
              <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
            ) : enquiries && enquiries.length > 0 ? (
              viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  {STATUS_COLUMNS.map((col) => (
                    <div key={col.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 px-2">
                        <div className={cn("w-2 h-2 rounded-full", col.color)} />
                        <h3 className="font-bold text-primary">{col.label}</h3>
                        <Badge variant="secondary">{enquiries.filter(e => (e.status || 'Pending') === col.id).length}</Badge>
                      </div>
                      <div className="flex flex-col gap-4 bg-muted/20 p-3 rounded-2xl min-h-[400px] border-2 border-dashed border-muted">
                        {enquiries.filter(e => (e.status || 'Pending') === col.id).map(e => (
                          <KanbanCard key={e.id} enquiry={e} onUpdateStatus={handleUpdateStatus} onSendToSecurity={handleSendToSecurity} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map(e => <KanbanCard key={e.id} enquiry={e} onUpdateStatus={handleUpdateStatus} onSendToSecurity={handleSendToSecurity} isList />)}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-muted-foreground">No enquiries found.</div>
            )}
          </TabsContent>

          <TabsContent value="security" className="animate-in fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl bg-white">
                <CardHeader><CardTitle className="text-primary">Add Contact</CardTitle></CardHeader>
                <CardContent>
                   <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = fd.get('name') as string;
                    const email = fd.get('email') as string;
                    const contactId = Math.random().toString(36).substring(7);
                    setDocumentNonBlocking(doc(firestore, 'security_team', contactId), { id: contactId, name, email, addedAt: new Date().toISOString() }, {});
                    (e.target as HTMLFormElement).reset();
                    toast({ title: "Contact Added" });
                  }} className="space-y-4">
                    <Input name="name" placeholder="Name" required />
                    <Input name="email" type="email" placeholder="Email" required />
                    <Button type="submit" className="w-full">Add to Team</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white">
                <CardHeader><CardTitle className="text-primary">Current Team</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {securityContacts?.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                      <div><p className="font-bold">{c.name}</p><p className="text-xs opacity-60">{c.email}</p></div>
                      <Button variant="ghost" size="icon" onClick={() => deleteDocumentNonBlocking(doc(firestore, 'security_team', c.id))} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function KanbanCard({ enquiry, onUpdateStatus, onSendToSecurity, isList }: { enquiry: any, onUpdateStatus: (id: string, s: string) => void, onSendToSecurity: (e: any) => void, isList?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleReviewClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSending(true);
    await onSendToSecurity(enquiry);
    setIsSending(false);
  };

  return (
    <Card className={cn("border shadow-sm hover:shadow-md transition-all bg-white cursor-pointer overflow-hidden", isExpanded && "ring-2 ring-primary")} onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
           <Badge variant="outline" className="text-[10px] font-mono">{enquiry.id.substring(0, 6)}</Badge>
           <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent className="text-xs">
              {['Pending', 'Reviewed', 'Confirmed', 'Rejected'].map(s => (
                <DropdownMenuItem key={s} onClick={(e) => { e.stopPropagation(); onUpdateStatus(enquiry.id, s); }}>Mark as {s}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
           </DropdownMenu>
        </div>
        <div>
          <h4 className="font-bold text-sm text-primary">{enquiry.name}</h4>
          <p className="text-[10px] opacity-60 flex items-center gap-1"><Calendar className="h-3 w-3" /> {enquiry.dateRequired}</p>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
           <span>{enquiry.startTime} - {enquiry.endTime}</span>
           {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>

        {isExpanded && (
          <div className="pt-2 border-t mt-2 space-y-2 text-[10px] animate-in fade-in slide-in-from-top-1">
            <div className="flex items-start gap-2">
              <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-primary">{enquiry.typeOfEvent}</p>
                <p className="flex items-center gap-1"><Users className="h-3 w-3" /> Attendance: {enquiry.estimatedAttendance}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
              <p className="truncate">{enquiry.emailAddress}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
              <p>{enquiry.postalAddress}, {enquiry.postcode}</p>
            </div>

            <div className="bg-muted/30 p-2 rounded italic mt-2">
              <p className="font-bold mb-1 opacity-60">Requirements:</p>
              {enquiry.additionalRequirements}
            </div>
          </div>
        )}

        {enquiry.status === 'Pending' && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full gap-2 text-[10px] h-8 mt-2" 
            onClick={handleReviewClick}
            disabled={isSending}
          >
            {isSending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            Request Security Review
          </Button>
        )}
      </div>
    </Card>
  );
}
