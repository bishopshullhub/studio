
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Wifi, Coffee, Users, Car, MapPin, User, Calendar, ClipboardCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  // Step 1: Contact
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  
  // Step 2: Event Details
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  attendance: z.string().min(1, "Est. attendance required"),
  
  // Step 3: Requirements
  typeOfEvent: z.string().min(2, "Event type is required"),
  requirements: z.string().optional(),
  agreedToTerms: z.boolean().refine(v => v === true, "You must agree to the terms"),
});

type FormValues = z.infer<typeof formSchema>;

export default function HirePage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requirements: "",
      agreedToTerms: false,
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['name', 'email', 'phone'];
    if (step === 2) fieldsToValidate = ['date', 'startTime', 'endTime', 'attendance'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Enquiry Sent",
      description: "We've received your multi-step booking enquiry and will be in touch shortly.",
    });
    form.reset();
    setStep(1);
  }

  const progress = (step / totalSteps) * 100;

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Hire the Hub</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Our modern, flexible space is available for private functions, corporate events, 
              classes, and community groups. Modern facilities in a tranquil village setting.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Multi-step Form Container */}
            <section id="booking-form" className="scroll-mt-24">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-border">
                
                {/* Progress Indicator */}
                <div className="mb-10 space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {step} of {totalSteps}</span>
                      <h2 className="text-2xl font-headline font-bold text-primary">
                        {step === 1 && "Contact Information"}
                        {step === 2 && "Event Details"}
                        {step === 3 && "Additional Requirements"}
                      </h2>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  {/* Step Icons (Desktop) */}
                  <div className="hidden md:flex justify-between mt-6">
                    {[
                      { id: 1, label: "Contact", icon: User },
                      { id: 2, label: "Event", icon: Calendar },
                      { id: 3, label: "Logistics", icon: ClipboardCheck }
                    ].map((s) => (
                      <div key={s.id} className={cn(
                        "flex items-center gap-2",
                        step >= s.id ? "text-primary" : "text-muted-foreground opacity-50"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2",
                          step >= s.id ? "border-primary bg-primary/10" : "border-muted"
                        )}>
                          <s.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* STEP 1: CONTACT */}
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Full Name</FormLabel>
                              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl><Input placeholder="07123 456789" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* STEP 2: EVENT DETAILS */}
                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Date Required</FormLabel>
                              <FormControl><Input type="date" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl><Input type="time" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl><Input type="time" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="attendance"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Estimated Attendance</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g. 50" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* STEP 3: REQUIREMENTS */}
                    {step === 3 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <FormField
                          control={form.control}
                          name="typeOfEvent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type of Event</FormLabel>
                              <FormControl><Input placeholder="e.g. Birthday Party, Yoga Class" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Requirements</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Let us know if you need kitchen access, bar service, or any other specifics." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="agreedToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-xl bg-muted/30">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I have read and agree to the <a href="/hire-agreement" className="text-primary hover:underline underline-offset-4">Standard Conditions of Hire</a>.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-muted">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                        className={cn(step === 1 && "invisible")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>

                      {step < totalSteps ? (
                        <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary/90 px-8">
                          Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" className="bg-primary hover:bg-primary/90 px-12">
                          Submit Booking Enquiry
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Facility Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Users, label: "Capacity", value: "Up to 110 people" },
                  { icon: Wifi, label: "Connectivity", value: "Free High-speed Wi-Fi" },
                  { icon: Coffee, label: "Kitchen", value: "Full catering kitchen available" },
                  { icon: Car, label: "Parking", value: "On-site parking for 18-25 cars" },
                  { icon: MapPin, label: "Accessibility", value: "Full disabled access & facilities" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                    <item.icon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-xl text-primary font-headline">Hire Prices</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-muted">
                    <tr>
                      <td className="px-6 py-4 font-medium">Residents / Groups</td>
                      <td className="px-6 py-4 font-bold text-primary">£15.00/hr</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Commercial Rate</td>
                      <td className="px-6 py-4 font-bold text-primary">£20.00/hr</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Kids Party (3hr)</td>
                      <td className="px-6 py-4 font-bold text-primary">£45.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-6 bg-muted/20">
                  <p className="text-xs text-muted-foreground italic">
                    * Prices include tables, chairs, and basic kitchen use.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-xl text-primary font-headline">Checklist</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    "Read the Hire Agreement",
                    "Check noise abatement policy",
                    "Understand cleaning duties",
                    "Confirm date availability",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-bold">Need Help?</h3>
                <p className="opacity-90">
                  Our volunteer bookings secretary is here to help with your event planning.
                </p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70 font-headline">Direct Email</p>
                  <p className="text-xl font-bold">bhhubbookings@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
