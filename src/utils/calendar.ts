import { CampusEvent } from '../types/campus';

/**
 * Generates and triggers download of a standardized iCalendar (.ics) file.
 */
export function downloadEventICS(event: CampusEvent): void {
  const startDate = new Date(event.date);
  // Default duration 3 hours if not explicitly specified
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startFormatted = formatICSDate(startDate);
  const endFormatted = formatICSDate(endDate);
  const nowFormatted = formatICSDate(new Date());

  const cleanDescription = (event.description || '').replace(/\n/g, '\\n');
  const cleanTitle = event.title.replace(/[^\w\s-]/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IIIT Manipur//CampusConnect//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:iiitm-${event.id}@campusconnect.iiitmanipur.ac.in`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${event.venue}`,
    `ORGANIZER;CN=${event.organizingClub}:mailto:events@iiitmanipur.ac.in`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${event.id}-schedule.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
