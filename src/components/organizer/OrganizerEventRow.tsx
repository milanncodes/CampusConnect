import React, { useState } from 'react';
import { CampusEvent } from '../../types/campus';
import { formatEventDate } from '../../utils/date';
import { getCategoryBadgeClasses } from '../../utils/categoryTheme';
import { getGeometricBannerFallback } from '../../utils/imageFallback';
import {
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface OrganizerEventRowProps {
  event: CampusEvent;
  onEdit: (event: CampusEvent) => void;
  onDelete: (id: string) => void;
  onViewDetails: (event: CampusEvent) => void;
}

export const OrganizerEventRow: React.FC<OrganizerEventRowProps> = ({
  event,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fillRate = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isFull = event.registeredCount >= event.capacity;
  const isNearCapacity = !isFull && fillRate >= 80;

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete(event.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <tr className="border-b border-slate-200/80 hover:bg-slate-50/80 transition-colors">
      {/* Event Details & Thumbnail */}
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative border border-slate-200">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getGeometricBannerFallback(event.title, event.category);
              }}
            />
            {event.featured && (
              <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-slate-900" />
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-xs sm:max-w-sm">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block truncate">
              {event.organizingClub}
            </span>
            <button
              type="button"
              onClick={() => onViewDetails(event)}
              className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors text-left truncate block max-w-full"
            >
              {event.title}
            </button>
            <span className="text-xs text-slate-600 line-clamp-1 mt-0.5">
              {event.description}
            </span>
          </div>
        </div>
      </td>

      {/* Category with semantic pastel badge */}
      <td className="py-4 px-3 whitespace-nowrap">
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeClasses(event.category)}`}>
          {event.category}
        </span>
      </td>

      {/* Schedule & Venue */}
      <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 font-medium text-slate-900">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </td>

      {/* Registration Telemetry */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="w-36 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-900 font-bold tabular-nums">
              {event.registeredCount}{' '}
              <span className="font-normal text-slate-500">/ {event.capacity}</span>
            </span>
            <span className="text-xs text-slate-700 font-semibold tabular-nums">{fillRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-rose-500' : isNearCapacity ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${fillRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {Math.max(0, event.capacity - event.registeredCount)} spots open
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-4 px-3 whitespace-nowrap">
        {isFull ? (
          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            Full Capacity
          </span>
        ) : isNearCapacity ? (
          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Near Capacity
          </span>
        ) : (
          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Open
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1.5">
          {/* View Details */}
          <button
            type="button"
            onClick={() => onViewDetails(event)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="View Event Details"
            aria-label={`View details for ${event.title}`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Edit Event"
            aria-label={`Edit ${event.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button / Confirm */}
          {showDeleteConfirm ? (
            <div className="inline-flex items-center space-x-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
              <span className="text-[11px] text-rose-700 font-semibold flex items-center">
                <AlertTriangle className="w-3 h-3 mr-0.5" />
                Sure?
              </span>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 px-1.5 py-0.5 rounded transition-all"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[11px] text-slate-500 hover:text-slate-700 px-1"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Delete Event"
              aria-label={`Delete ${event.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
