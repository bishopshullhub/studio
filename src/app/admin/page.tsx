
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutDashboard, Settings, LogOut, Inbox, User, Mail, Phone, Clock, Calendar, ShieldAlert, Key, LogIn, FileText, CheckCircle2, MoreVertical, ArrowRight, XCircle, Clock3, LayoutGrid, List } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const STATUS_COLUMNS = [
  { id: 'Pending', label: 'Pending', color: 'bg-amber-500', icon: Clock3 },
  { id: 'Reviewed', label: 'Reviewed', color: 'bg-blue-500', icon: FileText },
  { id: 'Confirmed', label: 'Confirmed', color: 'bg-green-500', icon: CheckCircle2 },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-500', icon: XCircle },
];

export default function AdminPortal() {
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading } = useFirebase();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
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
                <Button variant="ghost" size="sm" onClick={() => handleCopyUID(user.uid)} className="h-6 text-[10px] uppercase font-bold">Copy</Button>
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
          
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1 border shadow-sm flex items-center mr-2">
              <Button 
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" /> Kanban
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" /> List
              </Button>
            </div>
            <Button variant="outline" className="gap-2 shadow-sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
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
                  const Icon = column.icon;
                  
                  return (
                    <div key={column.id} className="flex flex-col gap-4 min-h-[500px]">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", column.color)} />
                          <h3 className="font-bold text-primary font-headline">{column.label}</h3>
                          <Badge variant="secondary" className="ml-1">{columnEnquiries.length}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 bg-muted/20 p-3 rounded-2xl min-h-[400px] border-2 border-dashed border-muted">
                        {columnEnquiries.map((enquiry) => (
                          <KanbanCard 
                            key={enquiry.id} 
                            enquiry={enquiry} 
                            onUpdateStatus={handleUpdateStatus} 
                          />
                        ))}
                        {columnEnquiries.length === 0 && (
                          <div className="flex-1 flex items-center justify-center p-8 text-center">
                            <p className="text-xs text-muted-foreground italic">No {column.label.toLowerCase()} enquiries</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
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
                          enquiry.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                          'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        }>
                          {enquiry.status || 'Pending'}
                        </Badge>
                        <select 
                          className="text-[10px] font-bold border-none bg-transparent outline-none focus:ring-0 cursor-pointer"
                          value={enquiry.status || 'Pending'}
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
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-center space-y-4">
            <Inbox className="h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-bold text-muted-foreground">Your inbox is empty</h3>
            <p className="text-sm text-muted-foreground max-w-xs">New booking enquiries from the Hub website will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanCard({ enquiry, onUpdateStatus }: { enquiry: any, onUpdateStatus: (id: string, s: string) => void }) {
  const date = new Date(enquiry.submissionDateTime);
  
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">ID: {enquiry.id.substring(0, 6)}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={() => onUpdateStatus(enquiry.id, 'Pending')} className="gap-2">
                <Clock3 className="h-3 w-3 text-amber-500" /> Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(enquiry.id, 'Reviewed')} className="gap-2">
                <FileText className="h-3 w-3 text-blue-500" /> Mark as Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(enquiry.id, 'Confirmed')} className="gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" /> Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(enquiry.id, 'Rejected')} className="gap-2">
                <XCircle className="h-3 w-3 text-red-500" /> Mark as Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h4 className="font-bold text-sm text-primary line-clamp-1">{enquiry.name}</h4>
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

        {enquiry.additionalRequirements && enquiry.additionalRequirements !== "None provided" && (
          <p className="text-[10px] italic text-muted-foreground line-clamp-2 mt-2 bg-amber-50 p-1.5 rounded">
            "{enquiry.additionalRequirements}"
          </p>
        )}
      </div>
      
      <div className="px-4 py-2 border-t bg-muted/10 flex justify-between items-center">
        <span className="text-[9px] text-muted-foreground font-medium uppercase">
          {date.toLocaleDateString()}
        </span>
        <div className="flex gap-1">
          {enquiry.status !== 'Confirmed' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onUpdateStatus(enquiry.id, 'Confirmed')}
              title="Confirm"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {enquiry.status === 'Pending' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onUpdateStatus(enquiry.id, 'Reviewed')}
              title="Review"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
