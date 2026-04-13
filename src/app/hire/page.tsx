"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Wifi, Coffee, Users, Car, MapPin, User, Calendar, ClipboardCheck, ArrowRight, ArrowLeft, Info, AlertTriangle, CheckSquare, Mail, Phone as PhoneIcon, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formSchema = z.object({
  // Step 2: Policy Acknowledgement
  acknowledgedPolicies: z.boolean().refine(v => v === true, "Please acknowledge the policies to continue"),
  
  // Step 3: Contact
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Postal address is required"),
  postcode: z.string().min(5, "Postcode is required"),
  phone: z.string().min(10, "Valid phone number required"),
  preferredContact: z.enum(["Email", "Phone"], {
    required_error: "Please select a preferred contact method",
  }),
  
  // Step 4: Event Details
  date: z.string().min(1, "Date is required").refine((val) => {
    if (!val) return false;
    const selectedDate = new Date(val);
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    minDate.setDate(minDate.getDate() + 14);
    return selectedDate >= minDate;
  }, "Bookings must be at least 14 days in advance"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  attendance: z.string().min(1, "Est. attendance required"),
  
  // Step 5: Requirements
  typeOfEvent: z.string().min(2, "Event type is required"),
  requirements: z.string().optional(),
  agreedToTerms: z.boolean().refine(v => v === true, "You must agree to the terms"),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return data.endTime > data.startTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type FormValues = z.infer<typeof formSchema>;

export default function HirePage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [minDateStr, setMinDateStr] = useState("");
  const totalSteps = 5;

  useEffect(() => {
    // Set minimum date to 14 days from now to prevent hydration mismatch
    const date = new Date();
    date.setDate(date.getDate() + 14);
    setMinDateStr(date.toISOString().split('T')[0]);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      postcode: "",
      phone: "",
      preferredContact: "Email",
      date: "",
      startTime: "",
      endTime: "",
      attendance: "",
      typeOfEvent: "",
      requirements: "",
      acknowledgedPolicies: false,
      agreedToTerms: false,
    },
  });

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  const calculateDuration = () => {
    if (!startTime || !endTime) return null;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes - startMinutes;
    if (diff <= 0) return null;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  };

  const duration = calculateDuration();

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) fieldsToValidate = ['acknowledgedPolicies'];
    if (step === 3) fieldsToValidate = ['name', 'email', 'address', 'postcode', 'phone', 'preferredContact'];
    if (step === 4) fieldsToValidate = ['date', 'startTime', 'endTime', 'attendance'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Enquiry Sent",
      description: "We've received your booking enquiry and will be in touch shortly.",
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

      <div className="container mx-auto px-4 -mt-10 space-y-12">
        {/* Hire Summary - Top Horizontal Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Hourly Rate", value: "£18.00", sub: "per hour" },
            { label: "Full Day Cap", value: "£140.00", sub: "over 8 hours" },
            { label: "Day Deposit", value: "£50.00", sub: "refundable" },
            { label: "Evening Deposit", value: "£100.00", sub: "refundable" },
          ].map((item, idx) => (
            <Card key={idx} className="border-none shadow-lg bg-white overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                <span className="text-3xl font-bold text-primary">{item.value}</span>
                <span className="text-xs italic text-muted-foreground">{item.sub}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Multi-step Form Container - Full Width */}
        <section id="booking-form" className="scroll-mt-24">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-border">
            
            {/* Progress Indicator */}
            <div className="mb-10 space-y-4">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {step} of {totalSteps}</span>
                  <h2 className="text-2xl font-headline font-bold text-primary">
                    {step === 1 && "Pricing & Availability"}
                    {step === 2 && "Venue Policies"}
                    {step === 3 && "Contact Information"}
                    {step === 4 && "Event Details"}
                    {step === 5 && "Additional Requirements"}
                  </h2>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {/* Step Icons (Desktop) */}
              <div className="hidden md:flex justify-between mt-6">
                {[
                  { id: 1, label: "Availability", icon: Calendar },
                  { id: 2, label: "Policies", icon: AlertTriangle },
                  { id: 3, label: "Contact", icon: User },
                  { id: 4, label: "Event", icon: ClipboardCheck },
                  { id: 5, label: "Logistics", icon: CheckSquare }
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
                
                {/* STEP 1: PRICING & AVAILABILITY */}
                {step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        <h3 className="text-xl font-bold">Live Availability Schedule</h3>
                      </div>
                      <p className="text-muted-foreground">Please check the schedule below for your preferred date and time before continuing.</p>
                      <div className="rounded-2xl border border-border overflow-hidden bg-muted/20">
                        <iframe 
                          src="https://v2.hallmaster.co.uk/Scheduler/View/10228?startRoom=0&amp;hideTitle=true&amp;hideTopBar=true&amp;hideButtons=true&amp;disableLinks=true" 
                          style={{ width: '100%', height: '800px', border: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: VENUE POLICIES */}
                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                        <div className="flex items-center gap-3 text-blue-700">
                          <div className="p-2 bg-blue-100 rounded-lg"><Info className="h-5 w-5" /></div>
                          <h3 className="font-bold text-lg">Bouncy Castles</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          We can have bouncy castles inside and outside 👍 please see our guidance in the 
                          <Link href="/bouncy-castles" className="text-primary font-semibold hover:underline px-1">Bouncy Castle guidance</Link> 
                          to help your choice.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                        <div className="flex items-center gap-3 text-amber-700">
                          <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
                          <h3 className="font-bold text-lg">Fireworks</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Due to the proximity of properties, schools and sports facilities we cannot permit the use of fireworks during the use of Bishops Hull Hub.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100 space-y-3">
                        <div className="flex items-center gap-3 text-red-700">
                          <div className="p-2 bg-red-100 rounded-lg"><Users className="h-5 w-5" /></div>
                          <h3 className="font-bold text-lg">Weddings</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Unfortunately we are unable to accommodate wedding ceremonies or formal receptions.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="acknowledgedPolicies"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-base font-bold text-primary">
                              I acknowledge these venue policies and restrictions.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* STEP 3: CONTACT */}
                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Your Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Your Email</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Preferred Method of Contact</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4 pt-2"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Email" />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center gap-1 cursor-pointer">
                                  <Mail className="h-4 w-4" /> Email
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Phone" />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center gap-1 cursor-pointer">
                                  <PhoneIcon className="h-4 w-4" /> Phone
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Postal Address</FormLabel>
                          <FormControl><Textarea placeholder="Enter your full street address" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl><Input placeholder="e.g. TA1 5EB" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone Number</FormLabel>
                          <FormControl><Input placeholder="07123 456789" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* STEP 4: EVENT DETAILS */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="md:col-span-2 space-y-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <Info className="h-4 w-4" />
                          Deposit Information
                        </div>
                        <p>Please note any evening events extending beyond 8pm will hold a <strong>£100</strong> refundable deposit. All other bookings will require a <strong>£50</strong> deposit.</p>
                        <p className="text-muted-foreground italic">Deposits will be returned upon return of the facility in the condition found within 2 days of the hire.</p>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Date Required (Minimum 14 days in advance)</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              min={minDateStr}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time (15-min increments)</FormLabel>
                          <FormControl>
                            <Input type="time" step="900" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time (15-min increments)</FormLabel>
                          <FormControl>
                            <Input type="time" step="900" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {duration && (
                      <div className="md:col-span-2 p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-bold text-primary">Total Booking Duration: {duration}</span>
                      </div>
                    )}

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

                {/* STEP 5: REQUIREMENTS */}
                {step === 5 && (
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
                              I have read and agree to the <Link href="/hire-agreement" className="text-primary hover:underline underline-offset-4">Standard Conditions of Hire</Link>.
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
                      {step === 1 ? "Start Enquiry" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
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

        {/* Bottom Section: Checklist and Facility Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Facility Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Users, label: "Capacity", value: "Up to 110 people" },
                  { icon: Wifi, label: "Connectivity", value: "Free High-speed Wi-Fi" },
                  { icon: Coffee, label: "Kitchen", value: "Full catering kitchen available" },
                  { icon: Car, label: "Parking", value: "On-site parking for 18 spaces" },
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

          <div className="space-y-8">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-xl text-primary font-headline">Booking Checklist</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    "Check live availability above",
                    "Read the Venue Policies",
                    "Review the Hire Agreement",
                    "Understand cleaning duties",
                    "Confirm attendance < 110",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
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
