import { EventCategory } from '../types/campus';

export function getCategoryBadgeClasses(category: EventCategory): string {
  switch (category) {
    case 'Technical':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Cultural':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Workshop':
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'Competition':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'Seminar':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
}
