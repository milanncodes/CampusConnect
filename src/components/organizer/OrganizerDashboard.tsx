import React, { useState, useMemo } from 'react';
import { CampusEvent } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import { OrganizerEventRow } from './OrganizerEventRow';
import { EventFormModal } from './EventFormModal';
import {
  PlusCircle,
  Filter,
  CalendarCheck2,
  Users,
  Percent,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

interface OrganizerDashboardProps {
  onSelectEvent: (event: CampusEvent) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onSelectEvent }) => {
  const { events, deleteEvent } = useCampusContext();

  const [selectedClub, setSelectedClub] = useState<string>('All');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CampusEvent | null>(null);

  // Extract list of all unique organizing clubs from events
  const uniqueClubs = useMemo(() => {
    const clubs = Array.from(new Set(events.map((e) => e.organizingClub)));
    clubs.sort();
    return clubs;
  }, [events]);

  // Filter events by selected club
  const filteredEvents = useMemo(() => {
    if (selectedClub === 'All') return events;
    return events.filter((e) => e.organizingClub === selectedClub);
  }, [events, selectedClub]);

  // Calculate live operational metrics
  const metrics = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const totalRegistrations = filteredEvents.reduce((acc, e) => acc + e.registeredCount, 0);
    const totalCapacity = filteredEvents.reduce((acc, e) => acc + e.capacity, 0);
    const avgFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
    const capacityAlerts = filteredEvents.filter((e) => {
      const rate = e.capacity > 0 ? (e.registeredCount / e.capacity) * 100 : 0;
      return rate >= 90;
    }).length;

    return {
      totalEvents,
      totalRegistrations,
      avgFillRate,
      capacityAlerts,
    };
  }, [filteredEvents]);

  const handleOpenCreateModal = () => {
    setEventToEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (event: CampusEvent) => {
    setEventToEdit(event);
    setFormModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Club Operations &amp; Event Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time seat telemetry, capacity floor enforcement, and attendee coordination for IIIT Manipur
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Club Filter Selector */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              aria-label="Filter events by organizing club"
            >
              <option value="All">All Clubs &amp; Societies</option>
              {uniqueClubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Create Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Events
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
              {metrics.totalEvents}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {selectedClub === 'All' ? 'Across all campus clubs' : selectedClub}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Attendees
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
              {metrics.totalRegistrations}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Confirmed student RSVPs
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fill Ratio
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
              {metrics.avgFillRate}%
            </p>
            <p className="text-[11px] text-indigo-700 font-medium mt-1">
              Average seat utilization
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Capacity Alerts
            </p>
            <p className="text-3xl font-extrabold text-amber-700 tabular-nums mt-1">
              {metrics.capacityAlerts}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Events &ge; 90% full capacity
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Events Management Table Container with Mobile Horizontal Scroll */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Event Ledger</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              {selectedClub !== 'All' && ` for ${selectedClub}`}
            </p>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            Scroll horizontally on smaller screens
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Event Details
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Schedule &amp; Venue
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Registration Telemetry
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <OrganizerEventRow
                    key={evt.id}
                    event={evt}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteEvent}
                    onViewDetails={onSelectEvent}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              No events found for this selection
            </h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              No campus events are currently published under &ldquo;{selectedClub}&rdquo;. Get started by publishing your club&apos;s first event.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Event</span>
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Event Modal */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};
