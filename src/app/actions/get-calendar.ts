
'use server';

import ical from 'node-ical';
import { startOfWeek, endOfWeek, isWithinInterval, addDays, format } from 'date-fns';

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
 * Fetches and parses the Hallmaster iCal stream for the current week.
 * This runs on the server to avoid CORS issues.
 */
export async function getLiveCalendarEventsAction() {
  try {
    const events = await ical.async.fromURL(ICAL_URL);
    
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const processedEvents: LiveEvent[] = [];

    Object.values(events).forEach((event) => {
      if (event.type === 'VEVENT') {
        const start = new Date(event.start);
        const end = new Date(event.end);

        // Filter for events in the current week (or just general upcoming)
        // We'll return everything and let the client filter if needed, 
        // but limiting to a reasonable range is better for performance.
        if (isWithinInterval(start, { start: weekStart, end: addDays(weekEnd, 14) })) {
          processedEvents.push({
            id: event.uid,
            summary: event.summary,
            start: start.toISOString(),
            end: end.toISOString(),
            description: event.description || '',
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
