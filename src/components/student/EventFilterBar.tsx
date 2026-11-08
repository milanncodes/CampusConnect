import React from 'react';
import { EventCategory } from '../../types/campus';
import { Search, X, Layers, BookmarkCheck, Sparkles, ArrowUpDown, Command } from 'lucide-react';

export type ViewTabMode = 'all' | 'registered';
export type SortOption = 'date' | 'popularity' | 'deadline';

interface EventFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string; // 'All' | EventCategory
  onCategoryChange: (category: string) => void;
  activeViewTab: ViewTabMode;
  onViewTabChange: (mode: ViewTabMode) => void;
  categoryCounts: Record<string, number>;
  totalEventsCount: number;
  registeredEventsCount: number;
  sortBy?: SortOption;
  onSortChange?: (option: SortOption) => void;
  onOpenSpotlight?: () => void;
}

const CATEGORIES: EventCategory[] = [
  'Technical',
  'Cultural',
  'Workshop',
  'Competition',
  'Seminar',
];

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeViewTab,
  onViewTabChange,
  categoryCounts,
  totalEventsCount,
  registeredEventsCount,
  sortBy = 'date',
  onSortChange,
  onOpenSpotlight,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* View Mode Tabs (All Events vs My Registered Events) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onViewTabChange('all')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeViewTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>All Discoverable Events</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold tabular-nums">
              {totalEventsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewTabChange('registered')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeViewTab === 'registered'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>My Registered Events</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                registeredEventsCount > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {registeredEventsCount}
            </span>
          </button>
        </div>

        {/* Sort Dropdown & Quick Search Cue */}
        <div className="flex items-center space-x-3">
          {onSortChange && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="event-sort" className="font-semibold text-slate-500">
                Sort:
              </label>
              <select
                id="event-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">Date (Soonest)</option>
                <option value="popularity">Popularity / Fill Rate</option>
                <option value="deadline">Closing Soon</option>
              </select>
            </div>
          )}

          {searchQuery.trim() && (
            <div className="hidden sm:flex items-center text-xs text-slate-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              <span>Results for &ldquo;{searchQuery}&rdquo;</span>
            </div>
          )}
        </div>
      </div>

      {/* Full-width Search Bar with Spotlight Trigger */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by event title, organizing club, venue, or keywords (e.g. 'ByteCraft', 'Lab 3', 'Hackathon')..."
          className="w-full pl-10 pr-24 py-3 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-xs text-slate-900"
          aria-label="Search campus events"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1.5">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            onOpenSpotlight && (
              <button
                type="button"
                onClick={onOpenSpotlight}
                className="hidden sm:inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
                title="Open Spotlight Search (Ctrl + K)"
              >
                <Command className="w-3 h-3 text-slate-400" />
                <span>K</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Category Filter Pills with Badges (Smooth Horizontal Touch Scroll) */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        role="group"
        aria-label="Filter events by category"
      >
        <button
          type="button"
          onClick={() => onCategoryChange('All')}
          className={`shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-600'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          <span>All Events</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
              selectedCategory === 'All' ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalEventsCount}
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-600'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  isSelected ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
