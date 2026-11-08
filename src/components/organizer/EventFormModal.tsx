import React, { useState, useEffect } from 'react';
import { CampusEvent, EventCategory } from '../../types/campus';
import { useCampusContext } from '../../context/CampusContext';
import {
  X,
  PlusCircle,
  Save,
  AlertCircle,
  Image,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  Layers,
} from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CampusEvent | null;
}

const PRESET_BANNERS = [
  {
    label: 'Code / Dev',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Cybersecurity',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'AI & Data',
    url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Cultural & Arts',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Robotics',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Auditorium / Tech',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
];

const PRESET_CLUBS = [
  'ByteCraft - Coding Club',
  'CyberSec Guild IIITM',
  'AeroKinetics - Robotics Club',
  'Tarang - Cultural Society',
  'IIITM ACM Student Chapter',
  'E-Cell IIIT Manipur',
  'Web & Android Development Club',
];

const VENUE_OPTIONS = [
  'Computer Lab 3 (Web Tech Lab)',
  'Computer Lab 1 & 2',
  'Auditorium - Academic Block',
  'Seminar Hall 1',
  'Seminar Hall 2',
  'Robotics Workshop Shed & Ground',
  'Open Air Amphitheatre',
  'Executive Seminar Hall & Incubation Center',
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
}) => {
  const { createEvent, updateEvent } = useCampusContext();

  const isEditing = Boolean(eventToEdit);

  // Form state fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizingClub, setOrganizingClub] = useState(PRESET_CLUBS[0]);
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState(VENUE_OPTIONS[0]);
  const [customVenue, setCustomVenue] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [capacity, setCapacity] = useState<number>(60);
  const [bannerUrl, setBannerUrl] = useState(PRESET_BANNERS[0].url);
  const [featured, setFeatured] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState('');

  // Errors and submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill on edit or reset on create
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setOrganizingClub(eventToEdit.organizingClub);
      setCategory(eventToEdit.category);
      setDate(eventToEdit.date ? eventToEdit.date.substring(0, 10) : '');
      setTime(eventToEdit.time);
      if (VENUE_OPTIONS.includes(eventToEdit.venue)) {
        setVenue(eventToEdit.venue);
        setCustomVenue('');
      } else {
        setVenue('Custom');
        setCustomVenue(eventToEdit.venue);
      }
      setRegistrationDeadline(
        eventToEdit.registrationDeadline
          ? eventToEdit.registrationDeadline.substring(0, 10)
          : ''
      );
      setCapacity(eventToEdit.capacity);
      setBannerUrl(eventToEdit.bannerUrl);
      setFeatured(eventToEdit.featured);
      setTagsInput(eventToEdit.tags ? eventToEdit.tags.join(', ') : '');
    } else {
      const defaultEventDate = new Date();
      defaultEventDate.setDate(defaultEventDate.getDate() + 7);
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 6);

      setTitle('');
      setDescription('');
      setOrganizingClub(PRESET_CLUBS[0]);
      setCategory('Technical');
      setDate(defaultEventDate.toISOString().substring(0, 10));
      setTime('10:00 AM - 01:00 PM');
      setVenue(VENUE_OPTIONS[0]);
      setCustomVenue('');
      setRegistrationDeadline(defaultDeadline.toISOString().substring(0, 10));
      setCapacity(60);
      setBannerUrl(PRESET_BANNERS[0].url);
      setFeatured(false);
      setTagsInput('Tech, Workshop, IIITM');
    }
    setErrors({});
  }, [eventToEdit, isOpen]);

  // Esc key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Event title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Event description is required.';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Please provide a more descriptive summary (min 20 chars).';
    }

    if (!date) {
      newErrors.date = 'Event date is required.';
    }

    if (!time.trim()) {
      newErrors.time = 'Time schedule is required.';
    }

    const finalVenue = venue === 'Custom' ? customVenue.trim() : venue;
    if (!finalVenue) {
      newErrors.venue = 'Venue location is required.';
    }

    if (!registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required.';
    } else if (date && new Date(registrationDeadline) > new Date(date)) {
      newErrors.registrationDeadline = 'Registration deadline cannot be scheduled after the event date.';
    }

    if (!capacity || capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1.';
    }

    // Capacity floor guardrail: cannot reduce below registered participants
    if (isEditing && eventToEdit && capacity < eventToEdit.registeredCount) {
      newErrors.capacity = `Cannot set capacity to ${capacity}. There are already ${eventToEdit.registeredCount} registered students.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const resolvedVenue = venue === 'Custom' ? customVenue.trim() : venue;

    const isoDate = new Date(`${date}T10:00:00.000Z`).toISOString();
    const isoDeadline = new Date(`${registrationDeadline}T23:59:59.000Z`).toISOString();

    if (isEditing && eventToEdit) {
      updateEvent(eventToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        organizingClub,
        category,
        date: isoDate,
        time: time.trim(),
        venue: resolvedVenue,
        registrationDeadline: isoDeadline,
        capacity: Number(capacity),
        bannerUrl,
        featured,
        tags: parsedTags.length > 0 ? parsedTags : eventToEdit.tags,
      });
    } else {
      createEvent({
        title: title.trim(),
        description: description.trim(),
        organizingClub,
        category,
        date: isoDate,
        time: time.trim(),
        venue: resolvedVenue,
        registrationDeadline: isoDeadline,
        capacity: Number(capacity),
        bannerUrl,
        featured,
        tags: parsedTags.length > 0 ? parsedTags : ['IIITM', category],
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-form-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              {isEditing ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 id="modal-form-title" className="text-lg font-bold text-slate-900 leading-tight">
                {isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Updating details for "${eventToEdit?.title}"`
                  : 'Publish a new technical, cultural, or competitive event for IIIT Manipur'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 pb-6">
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Northeast Cyber Defense CTF 2026"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Description &amp; Objectives <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of the event, eligibility, agenda, and instructions..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Organizing Club & Category (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Organizing Club / Society
              </label>
              <select
                value={organizingClub}
                onChange={(e) => setOrganizingClub(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRESET_CLUBS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Category Domain
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          {/* Date & Time (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.date ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Time Window <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 01:00 PM"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.time ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.time && <p className="text-xs text-rose-600 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Venue & Capacity (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Campus Venue <span className="text-rose-500">*</span>
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              >
                {VENUE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
                <option value="Custom">Custom Venue...</option>
              </select>

              {venue === 'Custom' && (
                <input
                  type="text"
                  value={customVenue}
                  onChange={(e) => setCustomVenue(e.target.value)}
                  placeholder="Enter custom room/hall name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {errors.venue && <p className="text-xs text-rose-600 mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Max Capacity <span className="text-rose-500">*</span>
                {isEditing && eventToEdit && (
                  <span className="ml-auto text-[11px] font-normal text-slate-500 lowercase">
                    ({eventToEdit.registeredCount} registered)
                  </span>
                )}
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCapacity(isNaN(val) ? 0 : Math.max(1, val));
                }}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.capacity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.capacity && (
                <p className="text-xs text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {errors.capacity}
                </p>
              )}
            </div>
          </div>

          {/* Registration Deadline & Tags (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registration Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.registrationDeadline
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 bg-white'
                }`}
              />
              {errors.registrationDeadline && (
                <p className="text-xs text-rose-600 mt-1">{errors.registrationDeadline}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. AI, DeepLearning, Hackathon"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Preset Banner Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
              <Image className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Cover Banner Photography
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_BANNERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBannerUrl(preset.url)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors active:scale-95 ${
                    bannerUrl === preset.url
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="Custom Unsplash Image URL..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Featured Spotlight Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Featured Spotlight Event
                </span>
                <span className="text-[11px] text-slate-500">
                  Feature prominently on the Student Discovery Hero banner
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
