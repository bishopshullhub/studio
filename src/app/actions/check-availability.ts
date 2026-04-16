'use server';

import ical from 'node-ical';
import { isSameDay } from 'date-fns';

const ICAL_URL = 'https://v2.hallmaster.co.uk/api/ical/GetICalStream?HallId=10228';

export type ClashingEvent = {
  summary: string;
  start: string; // ISO string
  end: string;   // ISO string
};

export type AvailabilityResult =
  | { status: 'available' }
  | { status: 'clash'; clashes: ClashingEvent[] }
  | { status: 'error'; message: string };

/**
 * Checks a requested date + time window against the live Hallmaster iCal feed.
 * Returns whether the slot is free, clashing, or whether the check failed.
 *
 * Overlap rule: two intervals clash when requestedStart < existingEnd AND requestedEnd > existingStart.
 */
export async function checkAvailabilityAction(
  date: string,       // "YYYY-MM-DD"
  startTime: string,  // "HH:mm"
  endTime: string     // "HH:mm"
): Promise<AvailabilityResult> {
  try {
    const requestedStart = new Date(`${date}T${startTime}:00`);
    const requestedEnd   = new Date(`${date}T${endTime}:00`);

    const events = await ical.async.fromURL(ICAL_URL);

    const clashes: ClashingEvent[] = [];

    Object.values(events).forEach((event) => {
      if (event.type !== 'VEVENT') return;

      const eventStart = new Date(event.start);
      const eventEnd   = new Date(event.end);

      // Only consider events on the same day
      if (!isSameDay(eventStart, requestedStart)) return;

      // Standard interval-overlap test
      if (requestedStart < eventEnd && requestedEnd > eventStart) {
        clashes.push({
          summary: event.summary || 'Existing booking',
          start: eventStart.toISOString(),
          end: eventEnd.toISOString(),
        });
      }
    });

    if (clashes.length > 0) {
      return { status: 'clash', clashes };
    }

    return { status: 'available' };
  } catch {
    return { status: 'error', message: 'Could not reach the live calendar. Please check the availability calendar in Step 1.' };
  }
}
