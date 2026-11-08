import React, { useState, useMemo } from 'react';
import { CampusEvent } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import { FeaturedEventHero } from './FeaturedEventHero';
import { EventFilterBar, ViewTabMode, SortOption } from './EventFilterBar';
import { EventCard } from './EventCard';
import { CalendarX2, RotateCcw, Sparkles } from 'lucide-react';

interface StudentDashboardProps {
  onOpenEventDetails: (event: CampusEvent) => void;
  onOpenSpotlight?: () => void;
  initialTab?: ViewTabMode;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenEventDetails,
  onOpenSpotlight,
  initialTab = 'all',
}) => {
  const { events, registeredEventIds } = useCampusContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeViewTab, setActiveViewTab] = useState<ViewTabMode>(initialTab);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Compute category counts across all events
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((evt) => {
      counts[evt.category] = (counts[evt.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Filter events based on active tab, category, and search query
  const filteredEvents = useMemo(() => {
    const list = events.filter((evt) => {
      // 1. Filter by tab ('all' vs 'registered')
      if (activeViewTab === 'registered') {
        if (!registeredEventIds.includes(evt.id)) {
          return false;
        }
      }

      // 2. Filter by category
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // 3. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesClub = evt.organizingClub.toLowerCase().includes(query);
        const matchesDesc = evt.description.toLowerCase().includes(query);
        const matchesVenue = evt.venue.toLowerCase().includes(query);
        const matchesTags = evt.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesClub && !matchesDesc && !matchesVenue && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    // 4. Sort results
    list.sort((a, b) => {
      if (sortBy === 'popularity') {
        const fillA = a.capacity > 0 ? a.registeredCount / a.capacity : 0;
        const fillB = b.capacity > 0 ? b.registeredCount / b.capacity : 0;
        return fillB - fillA;
      }
      if (sortBy === 'deadline') {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      }
      // default: 'date'
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return list;
  }, [events, registeredEventIds, activeViewTab, selectedCategory, searchQuery, sortBy]);

  // Top featured event (only show hero if on 'all' view tab and no search active)
  const showHero = activeViewTab === 'all' && !searchQuery.trim() && selectedCategory === 'All';
  const featuredEvent = useMemo(() => {
    return events.find((e) => e.featured) || events[0];
  }, [events]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setActiveViewTab('all');
    setSortBy('date');
  };

  return (
    <div className="space-y-8">
      {/* Featured Spotlight Hero */}
      {showHero && featuredEvent && (
        <FeaturedEventHero event={featuredEvent} onOpenDetails={onOpenEventDetails} />
      )}

      {/* Filter and Search Bar */}
      <EventFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeViewTab={activeViewTab}
        onViewTabChange={setActiveViewTab}
        categoryCounts={categoryCounts}
        totalEventsCount={events.length}
        registeredEventsCount={registeredEventIds.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenSpotlight={onOpenSpotlight}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium">
        <span>
          Showing <strong className="text-slate-900 tabular-nums">{filteredEvents.length}</strong>{' '}
          {filteredEvents.length === 1 ? 'event' : 'events'}
          {activeViewTab === 'registered' && ' in your schedule'}
          {selectedCategory !== 'All' && ` under ${selectedCategory}`}
        </span>

        {(searchQuery || selectedCategory !== 'All' || activeViewTab === 'registered') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Event Grid or Graceful Empty State */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelect={onOpenEventDetails} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <CalendarX2 className="w-8 h-8 text-slate-400" aria-hidden="true" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {activeViewTab === 'registered'
              ? 'No registered events found'
              : 'No campus events match your search'}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {activeViewTab === 'registered'
              ? 'You have not registered for any events matching your filter. Explore available events and reserve your spot.'
              : `We couldn't find any events matching "${searchQuery || selectedCategory}". Try adjusting your search keywords or switching category filters.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear all filters</span>
            </button>

            {activeViewTab === 'registered' && (
              <button
                type="button"
                onClick={() => setActiveViewTab('all')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Browse all events</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
