"use client";

import { useState, useMemo } from 'react';
import { DAYS, CATEGORIES, Activity } from '@/lib/schedule-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Info, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function WhatsOnPage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Firestore query for activities
  const scheduleQuery = useMemoFirebase(() => {
    return query(
      collection(window.firestore, 'weekly_schedules'),
      where('dayOfWeek', '==', selectedDay),
      orderBy('startTime', 'asc')
    );
  }, [selectedDay]);

  const { data: dbActivities, isLoading } = useCollection<Activity>(scheduleQuery);

  const filteredSchedule = useMemo(() => {
    if (!dbActivities) return [];
    if (!filterCategory) return dbActivities;
    return dbActivities.filter(item => item.category === filterCategory);
  }, [dbActivities, filterCategory]);

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">What's On</h1>
        <p className="text-xl text-muted-foreground">
          Explore our live weekly timetable of community activities and special events.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="bg-muted w-full md:w-auto h-auto p-1 flex">
              {DAYS.map(day => (
                <TabsTrigger 
                  key={day} 
                  value={day} 
                  className="flex-1 md:flex-none px-4 py-2 text-sm"
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
            className="rounded-full"
          >
            All
          </Button>
          {CATEGORIES.map(cat => (
            <Button 
              key={cat} 
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading timetable...</p>
          </div>
        ) : filteredSchedule.length > 0 ? (
          filteredSchedule.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-xl font-bold text-muted-foreground">No activities found for {selectedDay}.</h3>
            <p className="text-muted-foreground">Try selecting a different day or category.</p>
          </div>
        )}
      </div>

      <section id="tickets" className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 mt-16 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-headline font-bold text-primary">Special Event Tickets</h2>
          <p className="text-lg text-muted-foreground">
            Looking for fundraiser or seasonal event tickets? Purchase securely through our partner.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4">
            Browse All Tickets <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const catColors: Record<string, string> = {
    Fitness: "bg-blue-100 text-blue-700",
    Wellness: "bg-green-100 text-green-700",
    Youth: "bg-purple-100 text-purple-700",
    Community: "bg-orange-100 text-orange-700",
    Education: "bg-amber-100 text-amber-700",
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <Badge className={cn("rounded-full border-none", catColors[activity.category] || "bg-muted")}>
            {activity.category}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" /> {activity.startTime} - {activity.endTime}
          </span>
        </div>
        
        <h3 className="text-2xl font-headline font-bold text-primary group-hover:text-accent transition-colors">
          {activity.activityName}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-4">
          {activity.description}
        </p>

        <div className="pt-4 border-t border-muted flex flex-col gap-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            <span>Frequency: <span className="font-semibold text-foreground">{activity.frequency}</span></span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-muted/30 flex justify-between items-center">
        <span className="text-xs font-medium truncate max-w-[150px]">{activity.contactInfo}</span>
        <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
          <a href={`mailto:${activity.contactInfo}`}>Contact</a>
        </Button>
      </div>
    </Card>
  );
}
