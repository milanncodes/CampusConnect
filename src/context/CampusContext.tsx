import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CampusEvent, UserRole, StudentProfile, ToastNotification } from '../types/campus';
import { mockEvents, mockCurrentStudent } from '../data/mockEvents';

interface CampusContextType {
  events: CampusEvent[];
  role: UserRole;
  currentStudent: StudentProfile;
  registeredEventIds: string[];
  toasts: ToastNotification[];
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  registerForEvent: (eventId: string) => boolean;
  cancelRegistration: (eventId: string) => boolean;
  createEvent: (eventData: Omit<CampusEvent, 'id' | 'registeredCount'>) => string;
  updateEvent: (id: string, updated: Partial<CampusEvent>) => boolean;
  deleteEvent: (id: string) => boolean;
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  resetToMockData: () => void;
  simulateMaxCapacity: (eventId?: string) => void;
}

const STORAGE_KEYS = {
  EVENTS: 'campusconnect_events_v1',
  ROLE: 'campusconnect_role_v1',
  REGISTRATIONS: 'campusconnect_registered_event_ids_v1',
} as const;

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStudent] = useState<StudentProfile>(mockCurrentStudent);

  // Initialize Role with defensive localStorage retrieval
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole === 'student' || savedRole === 'organizer') {
        return savedRole;
      }
    } catch {
      // In-memory fallback if storage is restricted
    }
    return 'student';
  });

  // Initialize Events with seed fallback
  const [events, setEvents] = useState<CampusEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as CampusEvent[];
        }
      }
    } catch {
      // Fallback on parse failure
    }
    return mockEvents;
  });

  // Initialize Student Registrations
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string');
        }
      }
    } catch {
      // Fallback on parse failure
    }
    return ['ev-web-sprint-2026', 'ev-cyber-defense-ctf'];
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  }, [dismissToast]);

  // Persist events to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch {
      // Storage unavailable in private browsing mode
    }
  }, [events]);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    } catch {
      // Storage unavailable
    }
    showToast(
      `Switched to ${newRole === 'organizer' ? 'Club Organizer Portal' : 'Student View'}`,
      'info'
    );
  }, [showToast]);

  const toggleRole = useCallback(() => {
    setRole(role === 'student' ? 'organizer' : 'student');
  }, [role, setRole]);

  // Persist registrations to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registeredEventIds));
    } catch {
      // Storage unavailable
    }
  }, [registeredEventIds]);

  // Atomically register for event with capacity and duplicate validation
  const registerForEvent = useCallback((eventId: string): boolean => {
    const targetEvent = events.find((e) => e.id === eventId);

    if (!targetEvent) {
      showToast('Event not found.', 'error');
      return false;
    }

    if (registeredEventIds.includes(eventId)) {
      showToast('You are already registered for this event.', 'warning');
      return false;
    }

    if (targetEvent.registeredCount >= targetEvent.capacity) {
      showToast(`Registration closed. Capacity limit (${targetEvent.capacity}) reached.`, 'error');
      return false;
    }

    const deadlineDate = new Date(targetEvent.registrationDeadline);
    if (!isNaN(deadlineDate.getTime()) && new Date() > deadlineDate) {
      showToast('Registration deadline for this event has passed.', 'error');
      return false;
    }

    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === eventId
          ? { ...evt, registeredCount: Math.min(evt.capacity, evt.registeredCount + 1) }
          : evt
      )
    );

    setRegisteredEventIds((prev) => [...prev, eventId]);
    showToast(`Successfully registered for "${targetEvent.title}"!`, 'success');
    return true;
  }, [events, registeredEventIds, showToast]);

  // Cancel registration with counter decrement
  const cancelRegistration = useCallback((eventId: string): boolean => {
    const targetEvent = events.find((e) => e.id === eventId);

    if (!registeredEventIds.includes(eventId)) {
      showToast('You are not registered for this event.', 'warning');
      return false;
    }

    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === eventId
          ? { ...evt, registeredCount: Math.max(0, evt.registeredCount - 1) }
          : evt
      )
    );

    setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    showToast(
      targetEvent ? `Cancelled registration for "${targetEvent.title}".` : 'Registration cancelled.',
      'info'
    );
    return true;
  }, [events, registeredEventIds, showToast]);

  // Create new event
  const createEvent = useCallback(
    (eventData: Omit<CampusEvent, 'id' | 'registeredCount'>): string => {
      const generatedId = `ev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newEvent: CampusEvent = {
        ...eventData,
        id: generatedId,
        registeredCount: 0,
      };

      setEvents((prev) => [newEvent, ...prev]);
      showToast(`Event "${newEvent.title}" published successfully!`, 'success');
      return generatedId;
    },
    [showToast]
  );

  // Update existing event with capacity floor validation
  const updateEvent = useCallback(
    (id: string, updated: Partial<CampusEvent>): boolean => {
      const targetIndex = events.findIndex((e) => e.id === id);
      if (targetIndex === -1) {
        showToast('Event not found for update.', 'error');
        return false;
      }

      const current = events[targetIndex];

      if (typeof updated.capacity === 'number' && updated.capacity < current.registeredCount) {
        showToast(
          `Cannot reduce capacity to ${updated.capacity}. There are currently ${current.registeredCount} active registrants.`,
          'error'
        );
        return false;
      }

      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
      );

      showToast(`Event "${updated.title || current.title}" updated successfully.`, 'success');
      return true;
    },
    [events, showToast]
  );

  // Delete event with cascading registration cleanup
  const deleteEvent = useCallback((id: string): boolean => {
    const target = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setRegisteredEventIds((prev) => prev.filter((registeredId) => registeredId !== id));
    showToast(`Event "${target?.title || id}" removed.`, 'info');
    return true;
  }, [events, showToast]);

  // Reset to original mock fixtures
  const resetToMockData = useCallback(() => {
    setEvents(mockEvents);
    setRegisteredEventIds(['ev-web-sprint-2026', 'ev-cyber-defense-ctf']);
    setRoleState('student');
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mockEvents));
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(['ev-web-sprint-2026', 'ev-cyber-defense-ctf']));
      localStorage.setItem(STORAGE_KEYS.ROLE, 'student');
    } catch {
      // Storage unavailable
    }
    showToast('Reset to original IIIT Manipur mock fixtures.', 'info');
  }, [showToast]);

  // Simulate capacity saturation for demonstration purposes
  const simulateMaxCapacity = useCallback((eventId?: string) => {
    const target = eventId
      ? events.find((e) => e.id === eventId)
      : events.find((e) => e.registeredCount < e.capacity) || events[0];

    if (!target) return;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === target.id ? { ...e, registeredCount: e.capacity } : e
      )
    );
    showToast(
      `Simulated 100% capacity on "${target.title}" (${target.capacity}/${target.capacity} seats).`,
      'warning'
    );
  }, [events, showToast]);

  return (
    <CampusContext.Provider
      value={{
        events,
        role,
        currentStudent,
        registeredEventIds,
        toasts,
        setRole,
        toggleRole,
        registerForEvent,
        cancelRegistration,
        createEvent,
        updateEvent,
        deleteEvent,
        dismissToast,
        showToast,
        resetToMockData,
        simulateMaxCapacity,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};

export const useCampusContext = useCampus;
