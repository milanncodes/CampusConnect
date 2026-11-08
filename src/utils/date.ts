/**
 * Utilities for formatting event dates and deadlines
 */

export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDeadlineRelative(deadlineString: string): { label: string; isPast: boolean } {
  try {
    const deadline = new Date(deadlineString);
    if (isNaN(deadline.getTime())) {
      return { label: deadlineString, isPast: false };
    }

    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      return { label: 'Registration closed', isPast: true };
    }

    if (diffHours < 24) {
      return { label: `Closes in ${Math.max(1, diffHours)}h`, isPast: false };
    }

    if (diffDays <= 7) {
      return { label: `Closes in ${diffDays} days`, isPast: false };
    }

    const formatted = deadline.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return { label: `Closes ${formatted}`, isPast: false };
  } catch {
    return { label: 'Deadline info unavailable', isPast: false };
  }
}
