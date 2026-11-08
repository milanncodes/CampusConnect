import React from 'react';
import { Building, ShieldCheck, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Affiliation */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                CampusConnect · Unified Campus Event Management Platform
              </p>
              <p className="text-[11px] text-slate-500">
                Indian Institute of Information Technology Senapati, Manipur · Web &amp; Android Development Club
              </p>
            </div>
          </div>

          {/* Standards & Status Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Web Design Sprint 2026</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>WCAG 2.1 AA Compliant</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Client-Side LocalStorage</span>
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Competition Frontend Prototype. Developed for evaluative demonstration with zero-authentication instant role switching.
        </div>
      </div>
    </footer>
  );
};
