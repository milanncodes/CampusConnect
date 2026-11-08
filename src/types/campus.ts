export type EventCategory = 'Technical' | 'Cultural' | 'Workshop' | 'Competition' | 'Seminar';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  organizingClub: string;
  category: EventCategory;
  date: string; // ISO date string e.g. "2026-11-18T10:00:00.000Z"
  time: string; // e.g. "10:00 AM - 01:00 PM"
  venue: string; // e.g. "Seminar Hall 1", "Computer Lab 2", "Auditorium"
  registrationDeadline: string; // ISO date string
  capacity: number;
  registeredCount: number;
  tags: string[];
  bannerUrl: string; // Clean high-resolution Unsplash image
  featured: boolean;
}

export interface RegistrationRecord {
  id: string;
  eventId: string;
  studentId: string;
  registeredAt: string;
}

export type UserRole = 'student' | 'organizer';

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
