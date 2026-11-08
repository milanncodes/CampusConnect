import React, { useMemo } from 'react';
import { CampusEvent } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import { formatEventDate, formatDeadlineRelative } from '../../utils/date';
import { getCategoryBadgeClasses } from '../../utils/categoryTheme';
import { getGeometricBannerFallback } from '../../utils/imageFallback';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Hourglass,
  ArrowRight,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface EventCardProps {
  event: CampusEvent;
  onSelect: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const { registeredEventIds, events, registerForEvent, cancelRegistration } = useCampusContext();

  const isRegistered = registeredEventIds.includes(event.id);
  const isFull = event.registeredCount >= event.capacity;
  const deadlineInfo = formatDeadlineRelative(event.registrationDeadline);
  const fillPercentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  // Determine if the student already has another registered event on the same calendar day
  const hasScheduleConflict = useMemo(() => {
    if (isRegistered) return false;
    const eventDay = event.date.substring(0, 10);
    return events.some(
      (e) => e.id !== event.id && registeredEventIds.includes(e.id) && e.date.substring(0, 10) === eventDay
    );
  }, [events, registeredEventIds, event.id, event.date, isRegistered]);

  const handleRegisterToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRegistered) {
      cancelRegistration(event.id);
    } else {
      registerForEvent(event.id);
    }
  };

  return (
    <article
      onClick={() => onSelect(event)}
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500"
    >
      {/* Cover Image & Overlaid Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.bannerUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getGeometricBannerFallback(event.title, event.category);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Top-Left Category Pill with semantic palette */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${getCategoryBadgeClasses(event.category)}`}>
            {event.category}
          </span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Top-Right Status Badge */}
        <div className="absolute top-3 right-3">
          {isRegistered ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Registered</span>
            </span>
          ) : isFull ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-sm">
              Full / Waitlist
            </span>
          ) : deadlineInfo.isPast ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-white shadow-sm">
              Closed
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-600 text-white shadow-sm">
              Open
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organizing Club Row */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
            <span className="truncate">{event.organizingClub}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
            {event.title}
          </h3>

          {/* Event Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Schedule Conflict Alert Pill */}
          {hasScheduleConflict && (
            <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Schedule Alert: You have another event on this day</span>
            </div>
          )}

          {/* Logistics Metadata Rows */}
          <div className="space-y-1.5 text-xs text-slate-600 font-medium mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Capacity & Deadline Section */}
        <div className="pt-3 border-t border-slate-100">
          {/* Capacity Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Capacity</span>
              <span className="text-slate-800 tabular-nums">
                {event.registeredCount} / {event.capacity} filled
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  fillPercentage >= 100
                    ? 'bg-rose-500'
                    : fillPercentage >= 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Deadline Countdown Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
            <span className="flex items-center space-x-1">
              <Hourglass className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className={deadlineInfo.isPast ? 'text-rose-600 font-semibold' : ''}>
                {deadlineInfo.label}
              </span>
            </span>
            <span className="font-medium text-slate-500">
              {Math.max(0, event.capacity - event.registeredCount)} seats left
            </span>
          </div>

          {/* Action CTAs with tactile active feedback */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
              }}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <span>View Details</span>
            </button>

            {isRegistered ? (
              <button
                type="button"
                onClick={handleRegisterToggle}
                className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 group/cancel"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancel RSVP</span>
              </button>
            ) : isFull ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed opacity-60"
              >
                <span>At Capacity</span>
              </button>
            ) : deadlineInfo.isPast ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed opacity-60"
              >
                <span>Closed</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterToggle}
                className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Register Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
