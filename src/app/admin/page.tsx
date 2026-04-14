
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutDashboard, Settings, LogOut, Inbox, User, Mail, Phone, Clock, Calendar, ShieldAlert, Key, LogIn, FileText, CheckCircle2 } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function AdminPortal() {
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading } = useFirebase();
  const [activeTab, setActiveTab] = useState('enquiries');
  
  // Status check for Admin role in Firestore
  const adminDocRef = useMemoFirebase(() => {
    return user && !user.isAnonymous ? doc(firestore, 'admins', user.uid) : null;
  }, [firestore, user]);
  
  const { data: adminRecord, isLoading: checkingAdmin } = useDoc(adminDocRef);

  const enquiriesQuery = useMemoFirebase(() => {
    if (!adminRecord) return null;
    return query(collection(firestore, 'booking_enquiries'), orderBy('submissionDateTime', 'desc'));
  }, [firestore, adminRecord]);
  
  const { data: enquiries, isLoading: loadingEnquiries } = useCollection(enquiriesQuery);

  const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const docRef = doc(firestore, 'booking_enquiries', enquiryId);
      await updateDoc(docRef, { status: newStatus });
      toast({ title: "Status Updated", description: `Enquiry set to ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Permissions or connection error." });
    }
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

  if (!adminRecord) {
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
                <Button variant="ghost" size="xs" onClick={() => handleCopyUID(user.uid)} className="h-6 text-[10px] uppercase font-bold">Copy</Button>
              </div>
              <code className="block bg-white p-3 rounded border border-border text-xs break-all font-mono">
                {user.uid}
              </code>
            </div>
            <p className="text-sm text-center text-muted-foreground leading-relaxed">
              To grant access, please add this ID to the <strong>admins</strong> collection in the Firebase Console.
            </p>
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
          <Button variant="outline" className="gap-2 shadow-sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-border p-2">
              <nav className="space-y-1">
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
                        <div className="flex items-center gap-2">
                          <Badge className={
                            enquiry.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                            enquiry.status === 'Confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                            'bg-blue-100 text-blue-700 hover:bg-blue-100'
                          }>
                            {enquiry.status}
                          </Badge>
                          <select 
                            className="text-[10px] font-bold border-none bg-transparent outline-none focus:ring-0 cursor-pointer"
                            value={enquiry.status}
                            onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
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
                                <CheckCircle2 className="h-3 w-3" /> {enquiry.estimatedAttendance} guests
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
          </div>
        </div>
      </div>
    </div>
  );
}
