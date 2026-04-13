"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Wifi, Coffee, Users, Car, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  typeOfEvent: z.string().min(2, "Event type is required"),
  attendance: z.string().min(1, "Est. attendance required"),
  requirements: z.string().optional(),
});

export default function HirePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requirements: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Enquiry Sent",
      description: "We've received your booking enquiry and will be in touch shortly.",
    });
    form.reset();
  }

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
          <div className="lg:col-span-2 space-y-12 bg-white rounded-3xl p-8 shadow-xl border border-border">
            <section className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Facility Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Users, label: "Capacity", value: "Up to 100 people" },
                  { icon: Wifi, label: "Connectivity", value: "Free High-speed Wi-Fi" },
                  { icon: Coffee, label: "Kitchen", value: "Full catering kitchen available" },
                  { icon: Car, label: "Parking", value: "On-site parking for 25 cars" },
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

            <section className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Hire Prices</h2>
              <div className="border border-muted rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm">Hire Type</th>
                      <th className="px-6 py-4 font-bold text-sm">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Local Residents / Groups</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">£15.00 per hour</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Standard / Commercial Rate</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">£20.00 per hour</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Children's Party (3 hours)</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">£45.00 flat rate</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium">Whole Day Booking</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">Contact for quote</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic">
                * Prices include use of chairs, tables, and the basic kitchen facilities.
              </p>
            </section>

            <section id="booking-form" className="space-y-6 scroll-mt-24">
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">Booking Enquiry</h2>
                <p className="text-muted-foreground mb-8">
                  Please fill out the form below and our volunteer bookings secretary will get back to you as soon as possible.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
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
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
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
                        name="typeOfEvent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Event</FormLabel>
                            <FormControl><Input placeholder="e.g. Birthday Party" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="attendance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Est. Attendance</FormLabel>
                            <FormControl><Input type="number" placeholder="40" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">
                      Submit Booking Enquiry
                    </Button>
                  </form>
                </Form>
              </div>
            </section>
          </div>

          {/* Sidebar / Requirements Checklist */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="text-xl text-primary font-headline">Before You Book</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Please ensure you have read and understood our hiring policies.</p>
                <div className="space-y-3">
                  {[
                    "Confirm the hall is available on your date",
                    "Read the Hire Agreement policy",
                    "Understand our cleaning responsibilities",
                    "Check our noise abatement policy",
                    "Review insurance requirements"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href="/hire-agreement">Read Full Hire Agreement</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-bold">Have Questions?</h3>
                <p className="opacity-90">
                  If your enquiry is urgent or you have specific accessibility questions, feel free to email our volunteer team directly.
                </p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70">Email Us</p>
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