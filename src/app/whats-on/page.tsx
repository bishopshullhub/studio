
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DAYS } from '@/lib/schedule-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Loader2, Zap, CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import { getLiveCalendarEventsAction, LiveEvent } from '@/app/actions/get-calendar';
import { format, isToday, parseISO } from 'date-fns';

export default function WhatsOnPage() {
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'EEEE'));
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  // Fetch Live iCal Feed
  useEffect(() => {
    async function fetchLive() {
      setIsLiveLoading(true);
      const result = await getLiveCalendarEventsAction();
      if (result.success && result.events) {
        setLiveEvents(result.events);
      }
      setIsLiveLoading(false);
    }
    fetchLive();
  }, []);

  const dailyLiveEvents = useMemo(() => {
    return liveEvents.filter(e => e.dayOfWeek === selectedDay);
  }, [liveEvents, selectedDay]);

  const isCurrentDaySelected = useMemo(() => {
    return selectedDay === format(new Date(), 'EEEE');
  }, [selectedDay]);

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
          <Zap className="h-5 w-5 text-accent animate-pulse" /> Live Hub Calendar
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">What's On</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          View all current bookings and community activities happening at the Hub. This schedule is synced live with our Hallmaster booking system.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="bg-muted w-full md:w-auto h-auto p-1 flex">
              {DAYS.map(day => (
                <TabsTrigger 
                  key={day} 
                  value={day} 
                  className="flex-1 md:flex-none px-6 py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
            {selectedDay}&apos;s Schedule
            {isCurrentDaySelected && (
              <Badge className="bg-accent text-primary-foreground hover:bg-accent">TODAY</Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {dailyLiveEvents.length} events found
          </p>
        </div>
        
        {isLiveLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Syncing with live Hallmaster calendar...</p>
          </div>
        ) : dailyLiveEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyLiveEvents.map((event) => (
              <Card key={event.id} className="border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-3xl flex flex-col">
                <div className="p-8 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 font-bold text-[10px] uppercase">
                      Hall Booking
                    </Badge>
                    <div className="flex items-center gap-1.5 text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      {format(parseISO(event.start), 'HH:mm')} - {format(parseISO(event.end), 'HH:mm')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-primary group-hover:text-accent transition-colors">
                      {event.summary}
                    </h3>
                    {event.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-4">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </div>
                  )}
                </div>
                <div className="px-8 py-4 bg-muted/30 border-t flex justify-end group-hover:bg-primary/5 transition-colors">
                  <Button variant="ghost" size="sm" className="text-primary font-bold gap-2" asChild>
                    <a href="/hire#booking-form">Book this space <ExternalLink className="h-3 w-3" /></a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6 bg-muted/20 rounded-[3rem] border-2 border-dashed max-w-4xl mx-auto">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-muted-foreground">No one-off bookings scheduled for {selectedDay}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                The hall might be available for community use or last-minute hire!
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-2xl">
              <a href="/hire#booking-form">Check Availability</a>
            </Button>
          </div>
        )}
      </div>

      <section id="tickets" className="bg-primary rounded-[3rem] p-8 md:p-16 border border-primary/10 mt-16 text-center space-y-8 shadow-2xl text-primary-foreground">
        <div className="max-w-2xl mx-auto space-y-6">
          <Badge variant="secondary" className="bg-white/20 text-white border-none px-4 py-1">FUNDRAISERS & SPECIALS</Badge>
          <h2 className="text-4xl font-headline font-bold">Special Event Tickets</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Looking for fundraiser or seasonal event tickets? Purchase securely through our official ticketing partner to support the Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="px-8 shadow-lg text-primary font-bold">
              Browse All Tickets <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl border-white/20 text-white hover:bg-white/10">
              View Past Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
