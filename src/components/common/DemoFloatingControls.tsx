import React, { useState, useEffect } from 'react';
import { useCampusContext } from '../../context/CampusContext';
import {
  RotateCcw,
  Users,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DemoFloatingControls: React.FC = () => {
  const { role, resetToMockData, simulateMaxCapacity } = useCampusContext();
  const [collapsed, setCollapsed] = useState(false);

  // Keyboard shortcut listener: Ctrl + Shift + R to reset seed data
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        resetToMockData();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetToMockData]);

  return (
    <aside
      aria-label="Evaluation Demo Controls"
      className="fixed bottom-5 left-5 z-40 bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-2.5 backdrop-blur-md transition-all duration-300 max-w-sm sm:max-w-md"
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Left Indicator & Collapse Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand evaluator controls' : 'Collapse evaluator controls'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase text-[11px]">Judge Controls</span>
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Role Quick-Badge */}
        <span
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            role === 'student'
              ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
              : 'bg-amber-900/60 text-amber-300 border border-amber-700'
          }`}
        >
          {role === 'student' ? (
            <>
              <GraduationCap className="w-3 h-3 text-blue-400" />
              <span>Student View</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Organizer View</span>
            </>
          )}
        </span>
      </div>

      {/* Expanded Controls Toolbar */}
      {!collapsed && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Reset Seed Data Button */}
            <button
              type="button"
              onClick={resetToMockData}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-400"
              title="Reset all events, registrations and roles to clean IIIT Manipur fixtures"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reset Seed Data</span>
            </button>

            {/* Simulate Max Capacity Button */}
            <button
              type="button"
              onClick={() => simulateMaxCapacity()}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
              title="Instantly sets an event to 100% capacity to demonstrate 'At Capacity' state"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Max Capacity</span>
            </button>
          </div>

          {/* Keyboard Shortcut Hints */}
          <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
            <span>
              Reset shortcut: <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Ctrl+Shift+R</kbd>
            </span>
            <span className="text-slate-500">•</span>
            <span>
              Nav: <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Tab</kbd> / <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Esc</kbd>
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
