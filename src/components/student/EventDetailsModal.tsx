import React, { useState, useEffect } from 'react';
import { CampusEvent } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import { formatEventDate, formatDeadlineRelative } from '../../utils/date';
import { getCategoryBadgeClasses } from '../../utils/categoryTheme';
import { getGeometricBannerFallback } from '../../utils/imageFallback';
import { downloadEventICS } from '../../utils/calendar';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Tag,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  BadgeAlert,
  Download,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';

interface EventDetailsModalProps {
  event: CampusEvent;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const { registeredEventIds, registerForEvent, cancelRegistration, currentStudent, showToast } = useCampusContext();

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showPrintPass, setShowPrintPass] = useState(false);

  const isRegistered = registeredEventIds.includes(event.id);
  const isFull = event.registeredCount >= event.capacity;
  const deadlineInfo = formatDeadlineRelative(event.registrationDeadline);
  const fillPercentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const spotsRemaining = Math.max(0, event.capacity - event.registeredCount);

  // Esc key dismissal and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPrintPass) {
          setShowPrintPass(false);
        } else if (showCancelPrompt) {
          setShowCancelPrompt(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, showPrintPass, showCancelPrompt]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegister = () => {
    registerForEvent(event.id);
  };

  const handleConfirmCancel = () => {
    cancelRegistration(event.id);
    setShowCancelPrompt(false);
  };

  const handleCopyLink = () => {
    try {
      const url = `${window.location.origin}#${event.id}`;
      navigator.clipboard.writeText(url);
      showToast('Event link copied to clipboard!', 'info');
    } catch {
      showToast('Event link copied!', 'info');
    }
  };

  const handleDownloadCalendar = () => {
    downloadEventICS(event);
    showToast(`Calendar schedule for "${event.title}" downloaded.`, 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Visual Hero Header with Cover Image */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getGeometricBannerFallback(event.title, event.category);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
            aria-label="Close event details modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlaid Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${getCategoryBadgeClasses(event.category)}`}>
              {event.category}
            </span>
            {event.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                Featured Spotlight
              </span>
            )}
          </div>

          {/* Title & Club in Cover Base */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-200 mb-2 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>{event.organizingClub}</span>
            </div>
            <h2
              id="event-title"
              className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug drop-shadow-sm text-white"
            >
              {event.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Registered Status Banner */}
          {isRegistered && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    You&apos;re registered for this event!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Confirmed Attendee: <span className="font-semibold">{currentStudent.name}</span> ({currentStudent.rollNumber}) · {currentStudent.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowPrintPass(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Pass</span>
                </button>
              </div>
            </div>
          )}

          {/* 2-Column Info Grid (Switches to single column stack on mobile <768px) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Column: Event Narrative & Guidelines (3 cols on md) */}
            <div className="md:col-span-3 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-slate-400" />
                  About the Event
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Guidelines / Prerequisites */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Attendee Guidelines &amp; Prerequisites
                </h5>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Please carry your IIIT Manipur Institute Student ID Card for verification.</li>
                  <li>Arrive at the venue at least 15 minutes before scheduled start time.</li>
                  <li>For technical and workshop sessions, bring your personal laptop and charger.</li>
                  <li>Participation certificates will be provided upon session check-out.</li>
                </ul>
              </div>

              {/* Event Tags */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1.5 text-slate-400" />
                  Relevant Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Digital Student Pass Card & Creative Export Actions */}
              {isRegistered && (
                <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                        Digital Student Access Pass
                      </span>
                      <p className="text-xs text-indigo-700">
                        Venue Check-in: {event.venue}
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono">
                        PASS-ID: IIITM-EVT-{event.id.toUpperCase()}-2026
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white border border-indigo-200 rounded-lg flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                      <QrCode className="w-full h-full text-indigo-900" aria-label="Digital pass QR code" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-indigo-200/60 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadCalendar}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Add to Calendar (.ics)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Copy Event Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Key Facts & Capacity Card (2 cols on md) */}
            <div className="md:col-span-2 space-y-4">
              {/* Logistics Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Event Logistics
                </h4>

                {/* Date */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date</span>
                    <span className="font-semibold text-slate-900">{formatEventDate(event.date)}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Schedule</span>
                    <span className="font-semibold text-slate-900">{event.time}</span>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Campus Venue</span>
                    <span className="font-semibold text-slate-900">{event.venue}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-start space-x-3 text-xs pt-2 border-t border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <BadgeAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Registration Cutoff</span>
                    <span
                      className={`font-semibold ${
                        deadlineInfo.isPast ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {deadlineInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Capacity Tracker Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Capacity Tracker
                  </h4>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">
                    {fillPercentage}% Full
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fillPercentage >= 100
                        ? 'bg-rose-500'
                        : fillPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600 font-medium">
                    <strong className="text-slate-900 tabular-nums">{event.registeredCount}</strong> / {event.capacity} Claimed
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar (Sticky Footer) */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {isRegistered ? (
              <span className="text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Your seat is officially reserved
              </span>
            ) : isFull ? (
              <span className="text-rose-600 font-semibold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                This event has reached full capacity
              </span>
            ) : deadlineInfo.isPast ? (
              <span className="text-slate-600 font-semibold">
                Registrations have officially closed for this session
              </span>
            ) : (
              <span>Registration requires 1-click confirmation</span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Close
            </button>

            {/* Dynamic Registration Action Button */}
            {isRegistered ? (
              showCancelPrompt ? (
                <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-300 p-1.5 rounded-xl">
                  <span className="text-xs text-rose-800 font-medium px-2">
                    Release your seat?
                  </span>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
                  >
                    Yes, Release
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelPrompt(false)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Keep Spot
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Cancel My Registration</span>
                </button>
              )
            ) : isFull ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-200 border border-slate-300 cursor-not-allowed opacity-60"
              >
                <Users className="w-4 h-4" />
                <span>Event Reached Full Capacity</span>
              </button>
            ) : deadlineInfo.isPast ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-200 border border-slate-300 cursor-not-allowed opacity-60"
              >
                <span>Registration Closed</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Registration</span>
              </button>
            )}
          </div>
        </div>

        {/* Print-Friendly Pass Modal Overlay */}
        {showPrintPass && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Student Event Access Pass"
            className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Official Access Pass</h4>
                    <p className="text-[11px] text-slate-500">IIIT Senapati, Manipur</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrintPass(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-center py-2">
                  <div className="w-24 h-24 mx-auto bg-white p-2 border border-slate-200 rounded-xl shadow-2xs mb-2 flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
                    IIITM-EVT-{event.id.toUpperCase()}-2026
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Attendee:</span>
                    <span className="font-bold text-slate-900">{currentStudent.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Roll Number:</span>
                    <span className="font-mono font-bold text-slate-900">{currentStudent.rollNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Event:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]">
                      {event.title}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Venue:</span>
                    <span className="font-semibold text-slate-900">{event.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Schedule:</span>
                    <span className="font-semibold text-slate-900">{event.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrintPass(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
