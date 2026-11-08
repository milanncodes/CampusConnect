import React from 'react';
import { CampusEvent } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import { formatEventDate } from '../../utils/date';
import { getGeometricBannerFallback } from '../../utils/imageFallback';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';

interface FeaturedEventHeroProps {
  event?: CampusEvent;
  onOpenDetails?: (event: CampusEvent) => void;
}

export const FeaturedEventHero: React.FC<FeaturedEventHeroProps> = ({ event, onOpenDetails }) => {
  const { events, registeredEventIds, registerForEvent, cancelRegistration } = useCampusContext();

  const heroEvent = event || events.find((e) => e.featured) || events[0];

  if (!heroEvent) return null;

  const isRegistered = registeredEventIds.includes(heroEvent.id);
  const isFull = heroEvent.registeredCount >= heroEvent.capacity;
  const isDeadlinePassed = new Date(heroEvent.registrationDeadline) < new Date();

  const handleToggleRegistration = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRegistered) {
      cancelRegistration(heroEvent.id);
    } else {
      registerForEvent(heroEvent.id);
    }
  };

  return (
    <section
      aria-label="Featured Campus Spotlight Event"
      className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 text-white mb-8 group"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroEvent.bannerUrl}
          alt={heroEvent.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getGeometricBannerFallback(heroEvent.title, heroEvent.category);
          }}
        />
        {/* Rich Multi-stop gradient overlay for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-end min-h-[380px] sm:min-h-[420px]">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-400 text-slate-950 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" aria-hidden="true" />
            <span>Featured Spotlight</span>
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-md">
            {heroEvent.category}
          </span>

          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/80 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>{heroEvent.organizingClub}</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-3 drop-shadow-sm">
          {heroEvent.title}
        </h2>

        {/* Description */}
        <p className="text-slate-200 text-sm sm:text-base line-clamp-2 max-w-3xl mb-6 leading-relaxed">
          {heroEvent.description}
        </p>

        {/* Metadata Logistics Pill Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-200 font-medium mb-6">
          <div className="flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
            <span>{formatEventDate(heroEvent.date)}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{heroEvent.time}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>{heroEvent.venue}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300 text-xs sm:text-sm px-2">
            <span className="font-bold text-white tabular-nums">
              {heroEvent.registeredCount}/{heroEvent.capacity}
            </span>
            <span>spots filled</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Quick Register / Cancel Toggle Button */}
          {isRegistered ? (
            <button
              type="button"
              onClick={handleToggleRegistration}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group/btn"
              title="Click to cancel registration"
            >
              <CheckCircle2 className="w-4 h-4 group-hover/btn:hidden" />
              <XCircle className="w-4 h-4 hidden group-hover/btn:inline text-rose-200" />
              <span className="group-hover/btn:hidden">Registered</span>
              <span className="hidden group-hover/btn:inline">Cancel RSVP</span>
            </button>
          ) : isFull ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>Capacity Reached</span>
            </button>
          ) : isDeadlinePassed ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60"
            >
              <span>Registration Closed</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleRegistration}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span>Quick Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Secondary Action: View Full Details */}
          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(heroEvent)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>View Full Details</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
