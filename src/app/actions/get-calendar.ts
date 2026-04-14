
'use server';

import ical from 'node-ical';
import { startOfWeek, endOfWeek, isWithinInterval, addDays, subDays, addMonths, format } from 'date-fns';

export type LiveEvent = {
  id: string;
  summary: string;
  start: string; // ISO string
  end: string;   // ISO string
  description?: string;
  location?: string;
  dayOfWeek: string;
};

const ICAL_URL = 'https://v2.hallmaster.co.uk/api/ical/GetICalStream?HallId=10228';

/**
 * Fetches and parses the Hallmaster iCal stream.
 * Returns a window of events to support the week-by-week navigation.
 */
export async function getLiveCalendarEventsAction() {
  try {
    const events = await ical.async.fromURL(ICAL_URL);
    
    const now = new Date();
    // Fetch a wider range to support navigation (2 weeks back, 6 months forward)
    const rangeStart = subDays(startOfWeek(now, { weekStartsOn: 1 }), 14);
    const rangeEnd = addMonths(now, 6);

    const processedEvents: LiveEvent[] = [];

    Object.values(events).forEach((event) => {
      if (event.type === 'VEVENT') {
        const start = new Date(event.start);
        
        // Only include events within our navigation window
        if (isWithinInterval(start, { start: rangeStart, end: rangeEnd })) {
          // Clean descriptions: Remove Hallmaster booking links and redundant URLs
          const rawDescription = event.description || '';
          
          // Pattern to match Hallmaster booking links and general URLs
          const cleanedDescription = rawDescription
            .replace(/https:\/\/v2\.hallmaster\.co\.uk\/Scheduler\/ViewBooking\/\S+/g, '')
            .replace(/http[s]?:\/\/\S+/g, '') // Remove any other links
            .trim();

          processedEvents.push({
            id: event.uid || Math.random().toString(36),
            summary: event.summary,
            start: start.toISOString(),
            end: new Date(event.end).toISOString(),
            description: cleanedDescription,
            location: event.location || '',
            dayOfWeek: format(start, 'EEEE'),
          });
        }
      }
    });

    // Sort by start time
    return {
      success: true,
      events: processedEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    };
  } catch (error) {
    console.error('Failed to fetch iCal feed:', error);
    return { success: false, error: 'Failed to sync with live hall calendar' };
  }
}
