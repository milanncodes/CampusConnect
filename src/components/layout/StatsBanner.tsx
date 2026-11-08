import React, { useMemo } from 'react';
import { useCampusContext } from '../../context/CampusContext';
import {
  CalendarCheck,
  BookmarkCheck,
  Tag,
  Building2,
  Users,
  Percent,
} from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const { role, events, registeredEventIds } = useCampusContext();

  // Student stats computation
  const studentStats = useMemo(() => {
    const now = new Date();
    const openEventsCount = events.filter((evt) => {
      const isNotFull = evt.registeredCount < evt.capacity;
      const deadline = new Date(evt.registrationDeadline);
      const isBeforeDeadline = isNaN(deadline.getTime()) || deadline > now;
      return isNotFull && isBeforeDeadline;
    }).length;

    const myRegistrationsCount = registeredEventIds.length;
    const activeCategoriesCount = new Set(events.map((e) => e.category)).size;

    return {
      openEventsCount,
      myRegistrationsCount,
      activeCategoriesCount,
    };
  }, [events, registeredEventIds]);

  // Organizer stats computation
  const organizerStats = useMemo(() => {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((acc, evt) => acc + evt.registeredCount, 0);
    const totalCapacity = events.reduce((acc, evt) => acc + evt.capacity, 0);
    const fillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

    return {
      totalEvents,
      totalRegistrations,
      totalCapacity,
      fillRate,
    };
  }, [events]);

  return (
    <section
      aria-label="Executive Overview Statistics"
      className="bg-slate-50 border-b border-slate-200/80 py-5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {role === 'student' ? (
            <>
              {/* Stat 1: Open for Registration */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Open for Registration
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {studentStats.openEventsCount}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      / {events.length} events
                    </span>
                  </p>
                  <p className="text-xs text-emerald-600 font-medium flex items-center">
                    Seats available right now
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <CalendarCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              {/* Stat 2: My Registrations */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    My Registrations
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {studentStats.myRegistrationsCount}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">confirmed</span>
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {studentStats.myRegistrationsCount > 0
                      ? 'RSVPs synced & up to date'
                      : 'No active reservations'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <BookmarkCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              {/* Stat 3: Active Categories */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Categories
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {studentStats.activeCategoriesCount}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">domains</span>
                  </p>
                  <p className="text-xs text-sky-600 font-medium">
                    Technical, Cultural, Workshops & more
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Tag className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Organizer Stat 1: Total Events Hosted */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Events Hosted
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {organizerStats.totalEvents}
                  </p>
                  <p className="text-xs text-amber-700 font-medium">Across all campus clubs</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              {/* Organizer Stat 2: Total Registrations */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Registrations
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {organizerStats.totalRegistrations}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      / {organizerStats.totalCapacity} max capacity
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Cumulative campus engagement
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              {/* Organizer Stat 3: Average Fill Rate */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Average Fill Rate
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {organizerStats.fillRate}%
                  </p>
                  <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        organizerStats.fillRate >= 80
                          ? 'bg-rose-500'
                          : organizerStats.fillRate >= 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, organizerStats.fillRate)}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Percent className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
