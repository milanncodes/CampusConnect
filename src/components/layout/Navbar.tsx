import React, { useState } from 'react';
import { useCampusContext } from '../../context/CampusContext';
import {
  GraduationCap,
  ShieldCheck,
  Menu,
  X,
  Compass,
  BookmarkCheck,
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  Building,
  Command,
} from 'lucide-react';

export type StudentTab = 'explore' | 'registrations';
export type OrganizerTab = 'overview' | 'manage' | 'create';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenSpotlight?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'explore',
  onTabChange,
  onOpenSpotlight,
}) => {
  const { role, setRole, registeredEventIds, currentStudent } = useCampusContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand Lockup */}
          <div className="flex items-center space-x-6">
            <a
              href="#main-content"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(role === 'student' ? 'explore' : 'overview');
              }}
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    CampusConnect
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    IIIT Manipur
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline-block">
                  Unified Campus Event Management
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {role === 'student' ? (
                <>
                  <button
                    onClick={() => handleTabClick('explore')}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'explore'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                    <span>Explore Events</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('registrations')}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'registrations'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>My Registrations</span>
                    <span
                      className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                        registeredEventIds.length > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {registeredEventIds.length}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleTabClick('overview')}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>Club Overview</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('manage')}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'manage'
                        ? 'bg-amber-50 text-amber-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>Manage Events</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('create')}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'create'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                    <span>Create Event</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Section: Spotlight Search, Role Switcher & Student Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Spotlight Search Button */}
            {onOpenSpotlight && (
              <button
                type="button"
                onClick={onOpenSpotlight}
                className="hidden lg:inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                title="Search events and commands (Ctrl + K)"
              >
                <Command className="w-3.5 h-3.5 text-slate-400" />
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-500">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* Live Role Switcher Pill */}
            <div
              className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
              role="radiogroup"
              aria-label="User role switcher"
            >
              <button
                type="button"
                role="radio"
                aria-checked={role === 'student'}
                onClick={() => setRole('student')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <span>Student View</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={role === 'organizer'}
                onClick={() => setRole('organizer')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'organizer'
                    ? 'bg-white text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Organizer Portal</span>
              </button>
            </div>

            {/* Profile Avatar & Details */}
            <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                {currentStudent.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentStudent.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentStudent.rollNumber}
                </span>
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with 44px Minimum Touch Targets */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                AS
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">{currentStudent.name}</p>
                <p className="text-slate-500 font-mono">{currentStudent.rollNumber}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700">
              {currentStudent.department}
            </span>
          </div>

          <div className="space-y-1.5">
            {role === 'student' ? (
              <>
                <button
                  onClick={() => handleTabClick('explore')}
                  className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === 'explore'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    <span>Explore Events</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabClick('registrations')}
                  className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === 'registrations'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                    <span>My Registrations</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {registeredEventIds.length}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleTabClick('overview')}
                  className={`w-full min-h-[44px] flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-amber-600" />
                  <span>Club Overview</span>
                </button>

                <button
                  onClick={() => handleTabClick('manage')}
                  className={`w-full min-h-[44px] flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === 'manage'
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CalendarCheck className="w-5 h-5 text-amber-600" />
                  <span>Manage Events</span>
                </button>

                <button
                  onClick={() => handleTabClick('create')}
                  className={`w-full min-h-[44px] flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === 'create'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-5 h-5 text-indigo-600" />
                  <span>Create Event</span>
                </button>
              </>
            )}

            {/* Mobile Spotlight trigger */}
            {onOpenSpotlight && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSpotlight();
                }}
                className="w-full min-h-[44px] flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 mt-2"
              >
                <Command className="w-5 h-5 text-slate-400" />
                <span>Search Everything (Spotlight)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
