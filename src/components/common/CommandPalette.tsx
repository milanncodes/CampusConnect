import React, { useState, useEffect, useRef } from 'react';
import { useCampusContext } from '../../context/CampusContext';
import { CampusEvent } from '../../types/campus';
import { getCategoryBadgeClasses } from '../../utils/categoryTheme';
import {
  Search,
  MapPin,
  BookmarkCheck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (event: CampusEvent) => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
  onNavigateTab,
}) => {
  const { events, setRole, role, resetToMockData } = useCampusContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter events matching query
  const filteredEvents = events.filter((evt) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.organizingClub.toLowerCase().includes(q) ||
      evt.venue.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q) ||
      evt.tags.some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  // Quick actions definition
  const quickActions = [
    {
      id: 'my-registrations',
      label: 'Jump to My Registrations',
      icon: <BookmarkCheck className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onNavigateTab('registrations');
        onClose();
      },
    },
    {
      id: 'switch-role',
      label: role === 'student' ? 'Switch to Organizer Portal' : 'Switch to Student View',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      action: () => {
        setRole(role === 'student' ? 'organizer' : 'student');
        onClose();
      },
    },
    {
      id: 'reset-seed',
      label: 'Reset All Campus Data to Pristine State',
      icon: <RotateCcw className="w-4 h-4 text-indigo-600" />,
      action: () => {
        resetToMockData();
        onClose();
      },
    },
  ];

  const totalItems = filteredEvents.length + (!query.trim() ? quickActions.length : 0);

  // Handle keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredEvents.length) {
        onSelectEvent(filteredEvents[selectedIndex]);
        onClose();
      } else {
        const actionIdx = selectedIndex - filteredEvents.length;
        if (quickActions[actionIdx]) {
          quickActions[actionIdx].action();
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type an event name, club, lab venue, or category (e.g. 'Lab 3', 'ByteCraft')..."
            className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div id="command-results" className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredEvents.length > 0 && (
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Campus Events ({filteredEvents.length})
            </div>
          )}

          {filteredEvents.map((evt, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={evt.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectEvent(evt);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-50 border border-indigo-200/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={evt.bannerUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {evt.title}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryBadgeClasses(evt.category)}`}>
                        {evt.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                      <span className="truncate">{evt.organizingClub}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 pl-3">
                  <span className="text-xs font-semibold tabular-nums text-slate-600">
                    {evt.registeredCount}/{evt.capacity}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && query.trim() && (
            <div className="py-8 text-center text-sm text-slate-500">
              No campus events match &ldquo;{query}&rdquo;. Try another search term.
            </div>
          )}

          {/* Quick Action Commands (when query is empty) */}
          {!query.trim() && (
            <div className="pt-2 border-t border-slate-100 mt-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Shortcuts
              </div>
              {quickActions.map((action, actionIdx) => {
                const itemIndex = filteredEvents.length + actionIdx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={action.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={action.action}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-colors ${
                      isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {action.icon}
                      <span>{action.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Action</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-mono">↑</kbd>
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-mono ml-1">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-mono">↵</kbd> to select
            </span>
          </div>
          <span className="font-semibold text-slate-600">CampusConnect Spotlight</span>
        </div>
      </div>
    </div>
  );
};
