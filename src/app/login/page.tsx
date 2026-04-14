"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Handle redirection in an effect to avoid updating the router during render
  useEffect(() => {
    if (user && !user.isAnonymous) {
      router.push('/admin');
    }
  }, [user, router]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      initiateEmailSignIn(auth, values.email, values.password);
      toast({ title: "Welcome back", description: "Signing you in..." });
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials." });
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    try {
      initiateEmailSignUp(auth, values.email, values.password);
      toast({ title: "Account Created", description: "Welcome to the Hub Portal." });
    } catch (error) {
      toast({ variant: "destructive", title: "Signup Failed", description: "Could not create account." });
    } finally {
      setLoading(false);
    }
  }

  // Show a loader if we're already logged in and waiting for the effect to redirect
  if (isUserLoading || (user && !user.isAnonymous)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-headline">Portal Access</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Sign in to manage Hub activities and enquiries.
          </CardDescription>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
            <TabsTrigger value="login" className="data-[state=active]:bg-background">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-background">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="admin@bhhub.co.uk" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="p-6">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="volunteer@bhhub.co.uk" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="bg-muted/50 p-4 border-t">
          <p className="text-[10px] text-center w-full text-muted-foreground uppercase tracking-widest font-bold">
            Authorized Personnel Only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}