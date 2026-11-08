import React, { useState, useEffect } from 'react';
import { CampusProvider, useCampusContext } from './context/CampusContext';
import { Navbar } from './components/layout/Navbar';
import { StatsBanner } from './components/layout/StatsBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/layout/Footer';
import { DemoFloatingControls } from './components/common/DemoFloatingControls';
import { CommandPalette } from './components/common/CommandPalette';
import { StudentDashboard } from './components/student/StudentDashboard';
import { EventDetailsModal } from './components/student/EventDetailsModal';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { CampusEvent } from './types/campus';
import { AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, events } = useCampusContext();
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Validate localStorage availability with fallback
  useEffect(() => {
    try {
      const testKey = '__campusconnect_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
    } catch {
      setStorageWarning(true);
    }
  }, []);

  // Global keyboard listener for Ctrl + K / Cmd + K Spotlight Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const studentInitialTab = activeTab === 'registrations' ? 'registered' : 'all';
  const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) || null : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
      >
        Skip to main content
      </a>

      {/* Storage Fallback Warning Banner */}
      {storageWarning && (
        <div
          role="alert"
          className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center space-x-2 text-center"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Notice: Browser localStorage is restricted. The platform is operating in session memory mode.
          </span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
      />

      {/* Real-time Executive Stats Banner */}
      <StatsBanner />

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {role === 'student' ? (
          <StudentDashboard
            key={studentInitialTab}
            initialTab={studentInitialTab}
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
            onOpenEventDetails={(event: CampusEvent) => {
              setSelectedEventId(event.id);
            }}
          />
        ) : (
          <OrganizerDashboard
            onSelectEvent={(event: CampusEvent) => {
              setSelectedEventId(event.id);
            }}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {/* Global Command Palette / Spotlight Search */}
      <CommandPalette
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectEvent={(event: CampusEvent) => {
          setSelectedEventId(event.id);
        }}
        onNavigateTab={(tab: string) => {
          setActiveTab(tab);
        }}
      />

      {/* Demo Evaluator Controls */}
      <DemoFloatingControls />

      {/* Notification Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CampusProvider>
      <AppContent />
    </CampusProvider>
  );
};

export default App;
