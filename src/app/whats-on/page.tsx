
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DAYS, CATEGORIES, Activity } from '@/lib/schedule-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Info, ExternalLink, Calendar, Loader2, Zap, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { getLiveCalendarEventsAction, LiveEvent } from '@/app/actions/get-calendar';
import { format } from 'date-fns';

export default function WhatsOnPage() {
  const { firestore } = useFirebase();
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'EEEE'));
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  // Firestore query for managed activities
  const scheduleQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'weekly_schedules'),
      where('dayOfWeek', '==', selectedDay),
      orderBy('startTime', 'asc')
    );
  }, [firestore, selectedDay]);

  const { data: dbActivities, isLoading: isDbLoading } = useCollection<Activity>(scheduleQuery);

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

  const filteredSchedule = useMemo(() => {
    if (!dbActivities) return [];
    if (!filterCategory) return dbActivities;
    return dbActivities.filter(item => item.category === filterCategory);
  }, [dbActivities, filterCategory]);

  const dailyLiveEvents = useMemo(() => {
    return liveEvents.filter(e => e.dayOfWeek === selectedDay);
  }, [liveEvents, selectedDay]);

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
          <CalendarDays className="h-5 w-5" /> Live Hub Timetable
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">What's On</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Explore our live weekly timetable. We combine regular community activities with one-off hall bookings directly from our live calendar.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-4 rounded-3xl shadow-sm border">
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

        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterCategory(null)}
            className="rounded-full px-6"
          >
            All Categories
          </Button>
          {CATEGORIES.map(cat => (
            <Button 
              key={cat} 
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(cat)}
              className="rounded-full px-4"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left: Community Activities (Managed) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
              Regular Activities 
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                {filteredSchedule.length}
              </Badge>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isDbLoading ? (
              <div className="col-span-full py-20 text-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading regular activities...</p>
              </div>
            ) : filteredSchedule.length > 0 ? (
              filteredSchedule.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-30" />
                <p className="text-muted-foreground font-medium">No community activities scheduled for {selectedDay}.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Hall Bookings (iCal) */}
        <div className="xl:col-span-4 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
              Live Hall Bookings
              <Zap className="h-4 w-4 text-accent animate-pulse" />
            </h2>
          </div>

          <div className="space-y-4">
            {isLiveLoading ? (
              <div className="py-12 text-center bg-white rounded-3xl border shadow-sm">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Syncing with Hallmaster...</p>
              </div>
            ) : dailyLiveEvents.length > 0 ? (
              dailyLiveEvents.map((event) => (
                <Card key={event.id} className="border-none shadow-md bg-white p-5 group hover:bg-primary/5 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-accent/20 text-primary hover:bg-accent/30 border-none text-[10px] font-bold">
                      HALL BOOKING
                    </Badge>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{event.summary}</h3>
                  {event.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <div className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      📍 {event.location}
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="py-12 text-center bg-white rounded-3xl border border-dashed text-muted-foreground">
                <p className="text-sm font-medium">No one-off bookings today.</p>
                <p className="text-xs opacity-70">The hall is fully available for community use.</p>
              </div>
            )}
            
            <div className="p-6 bg-primary rounded-3xl text-primary-foreground space-y-4 shadow-xl">
              <h4 className="font-headline font-bold text-lg">Hiring the Hub?</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                See a gap in the schedule? You can book the hall for your own classes or events.
              </p>
              <Button asChild variant="secondary" className="w-full font-bold">
                <a href="/hire#booking-form">Start an Enquiry</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section id="tickets" className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 mt-16 text-center space-y-8 shadow-inner">
        <div className="max-w-2xl mx-auto space-y-6">
          <Badge className="bg-primary text-white px-4 py-1">FUNDRAISERS & SPECIALS</Badge>
          <h2 className="text-4xl font-headline font-bold text-primary">Special Event Tickets</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Looking for fundraiser or seasonal event tickets? Purchase securely through our official ticketing partner to support the Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 shadow-lg">
              Browse All Tickets <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl">
              Past Events Gallery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const catColors: Record<string, string> = {
    Fitness: "bg-blue-50 text-blue-700 border-blue-100",
    Wellness: "bg-green-50 text-green-700 border-green-100",
    Youth: "bg-purple-50 text-purple-700 border-purple-100",
    Community: "bg-orange-50 text-orange-700 border-orange-100",
    Education: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-white shadow-lg overflow-hidden flex flex-col rounded-3xl">
      <div className="p-8 flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <Badge className={cn("rounded-full border px-4 py-1 font-bold text-[10px] uppercase tracking-widest", catColors[activity.category] || "bg-muted")}>
            {activity.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            {activity.startTime} - {activity.endTime}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-headline font-bold text-primary group-hover:text-accent transition-colors duration-300">
            {activity.activityName}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {activity.description}
          </p>
        </div>

        <div className="pt-6 border-t border-muted flex flex-col gap-3">
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Info className="mr-2 h-4 w-4 text-primary" />
            <span>Frequency: <span className="text-foreground">{activity.frequency}</span></span>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-5 bg-muted/30 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Organizer Contact</span>
          <span className="text-xs font-semibold truncate max-w-[150px]">{activity.contactInfo}</span>
        </div>
        <Button variant="default" size="sm" className="bg-primary hover:bg-accent rounded-xl h-9 px-5 shadow-md" asChild>
          <a href={`mailto:${activity.contactInfo}`}>Join Group</a>
        </Button>
      </div>
    </Card>
  );
}
