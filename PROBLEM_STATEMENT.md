# IIIT Manipur Campus Event Management Platform (CampuSphere / Pulse)
## Product Requirements Document & Technical Problem Statement

**Document Version:** 1.0.0  
**Target Environment:** Client-Side Web Application (Prototype / Production-Grade UI)  
**Institution:** Indian Institute of Information Technology Senapati, Manipur (IIIT Manipur)  
**Status:** Approved Specification / Single Source of Truth (SSOT)

---

## 1. Executive Summary & Problem Context

### 1.1 Campus Context: IIIT Manipur
Indian Institute of Information Technology Senapati, Manipur (IIIT Manipur) is an autonomous Institute of National Importance hosting a vibrant community of undergraduate and postgraduate scholars, tech societies, cultural groups, and special interest clubs. Throughout the academic calendar, student-run bodies organize hackathons, coding contests, technical symposiums, robotics workshops, cultural evenings, and guest lectures.

### 1.2 The Problem: Campus Event Fragmentation & Registration Friction
Currently, event propagation and attendance workflows across IIIT Manipur suffer from severe fragmentation and operational inefficiency:
- **Scattered Information Channels:** Events are advertised across informal WhatsApp groups, Telegram channels, Instagram stories, physical poster boards across academic blocks, and mass emails. Students frequently miss flagship events or registration cutoffs due to noise and lack of a single discovery hub.
- **Manual & Opaque Registration Pipelines:** Organizers rely on one-off Google Forms. This causes:
  - No real-time feedback on seat availability or waitlists.
  - Uncontrolled duplicate entries requiring tedious post-processing.
  - Zero self-service cancellation, leading to high "no-show" rates (often exceeding 35%) while genuinely interested students are locked out.
- **Disjointed Organizer Operations:** Student club leads lack a unified interface to track live registration counts, manage capacity caps, update venue or timing changes, or monitor attendee demographics.
- **Authentication Overhead in Evaluative Prototypes:** Mandatory login walls during campus demonstrations or technical lab evaluations slow down exploration and usability testing.

### 1.3 Solution Vision
Build a high-performance, accessible, responsive, single-page web application that serves as the single source of truth for all campus events at IIIT Manipur. The platform delivers:
1. **Unified Student Discovery & RSVP Portal:** Categorized filtering, debounced search, responsive event grids, and an intuitive "My Registrations" management center.
2. **Robust Registration Engine:** One-click registration toggles, strict duplicate prevention, dynamic capacity tracking, self-service cancellations, and deadline enforcement.
3. **Streamlined Club Organizer Workspace:** Live capacity metrics, event creation with validation guardrails, and real-time roster inspection.
4. **Zero-Authentication Role Switcher:** Instant toggling between "Student View" and "Club Organizer View" with persistent state in `localStorage` backed by rich seed data representing genuine campus clubs.

---

## 2. Core Target Personas & Portals

```
                       +---------------------------------------+
                       |        Zero-Auth Role Switcher        |
                       |    [ Student View | Organizer View ]  |
                       +-------------------+-------------------+
                                           |
                  +------------------------+------------------------+
                  |                                                 |
                  v                                                 v
   +------------------------------+                  +------------------------------+
   |        STUDENT PORTAL        |                  |       ORGANIZER PORTAL       |
   +------------------------------+                  +------------------------------+
   | - Hero Banner & Featured Fest|                  | - Executive Metrics Overview |
   | - Categorized Filter Matrix  |                  | - Club Event Ledger          |
   | - Instant Debounced Search   |                  | - Create / Edit Event Modals |
   | - Real-Time RSVP / Cancel    |                  | - Real-Time Capacity Tracker |
   | - "My Registrations" Drawer  |                  | - Attendee Roster Inspection |
   +------------------------------+                  +------------------------------+
```

### 2.1 Target Personas

#### Persona A: The Student Attendee ("Aarav Sharma" — B.Tech CSE, 2nd Year)
- **Profile:** Active learner looking to build projects, attend workshops, participate in inter-college hackathons, and join cultural fests.
- **Needs:** Rapidly view what is happening this week, filter by domain (e.g. Technical vs. Cultural), know exactly how many seats remain, register with a single click, and view a consolidated personal schedule.
- **Frustrations:** Tedious forms asking for roll number repeatedly, broken links, discovering an event an hour after registrations closed.

#### Persona B: The Club Organizer ("Priya Devi" — 3rd Year, Lead of *ByteCraft* Coding Club)
- **Profile:** Organizes weekly competitive programming bouts, hackathons, and open-source bootcamps.
- **Needs:** Quick event publishing, setting hard seat limits (e.g. 60 seats in Lab 3), tracking registration velocity in real time, and editing venue or schedule changes without breaking existing sign-ups.
- **Frustrations:** Dealing with spreadsheet chaos, manually emailing waitlisted students, and managing overbooked computer lab sessions.

---

## 3. Functional Specifications

### 3.1 Student Dashboard & Discovery Suite

#### 3.1.1 Featured Banner / Hero Carousel
- **Purpose:** Showcase flagship, urgent, or high-priority campus events (e.g., Annual Tech Fest *Infotsav*, 36-hour Hackathon, Tarang Cultural Night).
- **Behavior:**
  - Displays event artwork/badge, event title, organizing club, date/time, and prominent "View Event" / "Register Now" action.
  - Automatically highlights up to 3 priority upcoming events with an auto-cycling or manual slide indicator.

#### 3.1.2 Categorized Filtering System
- **Taxonomy Categories:**
  1. `All Events` (Default view)
  2. `Technical` (Hackathons, Coding Sprints, Dev Talks)
  3. `Cultural` (Music Nights, Drama, Dance, Literary)
  4. `Workshop` (Hands-on training, AI/ML Labs, Cloud Bootcamps)
  5. `Competition` (Robotics, Gaming, Quiz leagues)
  6. `Seminar` (Distinguished faculty lectures, Research talks)
- **State Behavior:** Single-select or multi-select pill buttons with active visual indicators and clear count chips (e.g., `Technical (4)`).
- **Temporal Filter:** Secondary toggle to switch between `Upcoming Events`, `Happening Today`, and `Past Events`.

#### 3.1.3 Search & Discovery Engine
- **Search Scope:** Matches case-insensitively across:
  - Event Title
  - Organizing Club / Society Name
  - Venue / Location
  - Tags and Description Keywords
- **Debounce:** Client-side 250ms debouncing to ensure smooth typing performance.
- **Empty State:** When no records match, display a descriptive empty state with a "Clear Search" CTA.

#### 3.1.4 Responsive Event Grid & Event Card Architecture
Each card must present high-density, legible information:
- **Club Badge & Category Tag:** Distinct visual tags with accessible contrasting colors.
- **Event Title & Short Synopsis:** Clamped to 2 lines for visual alignment.
- **Metadata Badges:**
  - Date & Time (`DD MMM YYYY, hh:mm A`)
  - Venue (e.g. `Audi 1`, `Computer Lab 2`, `Open Air Theatre`)
  - Deadline Indicator (relative countdown, e.g. "Closes in 4 hours", or "Registration Closed")
- **Capacity Progress Gauge:**
  - Visual progress bar: Filled percentage = `(registeredCount / maxCapacity) * 100`.
  - Color thresholds:
    - `< 70%` capacity: Calm Emerald / Slate neutral (`bg-emerald-500` or neutral).
    - `70% - 94%` capacity: Attention Amber (`bg-amber-500`).
    - `>= 95%` or full: Urgent Crimson (`bg-rose-500` / `bg-red-600`).
  - Text counter: `X / Y seats filled` (or `Y - X seats left`).
- **Card CTA Actions:**
  - "View Details" (Opens full Event Details Modal).
  - Quick Toggle: "Register" / "Registered (Cancel)" / "Sold Out" / "Closed".

#### 3.1.5 "My Registrations" Dedicated View
- **Tab/Modal Access:** Accessible from the top navigation bar with a badge indicating the current user's active registration count (e.g., `My Registrations (3)`).
- **Functionality:**
  - Lists all events currently registered by the active student identity.
  - Chronologically ordered by upcoming event timestamp.
  - Provides instant "Cancel RSVP" action with confirmation feedback.
  - Quick "Add to Calendar (.ics)" download or placeholder action.
  - Graceful empty state when 0 events are booked with a "Browse Events" quick link.

---

### 3.2 Event Details Modal / Page View
When a student or organizer clicks an event card, an accessible modal opens with full metadata:

| Field | Description & UI Treatment |
|---|---|
| **Title & Club Header** | Full headline typography, club logo/avatar, verified campus club tag |
| **Category & Status** | Status chip: `Open`, `Filling Fast`, `Waitlist`, `Sold Out`, or `Completed` |
| **Date & Time Schedule** | Exact start and finish timestamps with standard Indian Standard Time (IST) formatting |
| **Venue Details** | Campus building, room/hall number, and seating instructions |
| **Registration Deadline** | Strict cut-off timestamp. Includes dynamic badge showing if deadline has passed |
| **Capacity Tracker** | Interactive progress bar, numeric count, and remaining seats warning |
| **Rich Description & Rules** | Multi-paragraph overview, prerequisites (e.g., "Bring your own laptop"), team sizes |
| **Contact Coordinators** | Student POC names and official institute email addresses |
| **Dynamic Action Bar** | Sticky footer with primary action: "Register for Event" / "Cancel Registration" / "Event Full" |

---

### 3.3 Robust Registration Engine

```
                     +---------------------------------------+
                     |            User Interaction           |
                     |      (Clicks "Register" or "Cancel")  |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |           Validation Checks           |
                     |  1. Has deadline passed?              |
                     |  2. Is capacity reached (if register)?|
                     |  3. Is duplicate entry?               |
                     +-------------------+-------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                   [Passed]                            [Failed]
                       |                                   |
                       v                                   v
        +-----------------------------+     +-----------------------------+
        |   Atomic State Mutation     |     |   Feedback Engine           |
        | - Toggle registered state   |     | - Trigger warning toast     |
        | - Increment/decrement count |     | - Prevent invalid mutation  |
        | - Update localStorage       |     +-----------------------------+
        +--------------+--------------+
                       |
                       v
        +-----------------------------+
        |    Success Notification     |
        |  "Registered Successfully!" |
        |  or "Registration Revoked"  |
        +-----------------------------+
```

#### 3.3.1 Business Rules & State Transitions
1. **One-Click Toggle:** A student can register with a single click. If already registered, the button switches to a distinct destructive/secondary state: "Cancel RSVP".
2. **Duplicate Registration Prevention:**
   - Registration store keys entries using a compound index: `${eventId}__${studentId}`.
   - Re-clicking register when already registered is strictly prohibited; the engine treats it as a cancellation request or no-op.
3. **Capacity Count Synchronization:**
   - Upon successful registration: `event.registeredCount += 1`.
   - Upon cancellation: `event.registeredCount = Math.max(0, event.registeredCount - 1)`.
   - If `event.registeredCount >= event.maxCapacity`, registration is blocked for non-registered users and marked "Sold Out".
4. **Registration Deadline Enforcement:**
   - If `new Date() > new Date(event.registrationDeadline)`, new registrations are rejected with an explicit toast: *"Registrations for this event have closed."*
   - Existing registrations may still be cancelled prior to event start.
5. **Persistence Guarantee:**
   - All registration states and adjusted event counts write directly to `localStorage` immediately upon state mutation.

---

### 3.4 Club Organizer Dashboard & Administration

#### 3.4.1 Executive Metric Overview
- **Total Campus Events Active:** Real-time count of non-expired events.
- **Total Registrations Managed:** Aggregate count of all student sign-ups.
- **Average Capacity Utilization Rate:** `(Sum of registeredCount / Sum of maxCapacity) * 100`.
- **Urgent Action Items:** Events closing in less than 24 hours with under 50% capacity.

#### 3.4.2 Club Event Management Table / Grid
- Displays events curated or owned by the selected club (with an option to view all clubs).
- Columns / Card details: Event Name, Date, Venue, Registered / Capacity, Status, and Quick Actions.
- Actions:
  - **Edit Event:** Opens modal to adjust capacity, venue, date, or description.
  - **View Attendees:** Expands attendee roster drawer showing mock student records.
  - **Delete / Archive:** Removes the event from active listings with safety prompt.

#### 3.4.3 Create Event Form (Modal / Dedicated View)
Input fields with real-time validation:
- **Event Title:** String (min 5, max 80 chars).
- **Club / Organizing Body:** Dropdown pre-populated with IIIT Manipur clubs.
- **Category:** Single select from the standard taxonomy.
- **Event Date & Time:** `datetime-local` picker (must be future date).
- **Registration Deadline:** `datetime-local` picker (must precede event date).
- **Venue:** Pre-populated dropdown with campus locations + custom text option:
  - *Academic Block Audi 1*
  - *Academic Block Audi 2*
  - *Computer Lab 1 (AI/ML Lab)*
  - *Computer Lab 2 (Systems Lab)*
  - *Computer Lab 3 (Web Tech Lab)*
  - *Open Air Amphitheatre*
  - *Sports Complex Ground*
  - *Virtual / Google Meet*
- **Maximum Capacity:** Numeric input (integer between 5 and 1000).
- **Description & Prerequisites:** Markdown/Plain-text multi-line area.

#### 3.4.4 Edit Event Form Guardrails
- **Capacity Floor Guard:** Organizers cannot reduce `maxCapacity` below the existing `registeredCount`. (e.g., if 45 students are registered, new capacity cannot be set to 40).
- **Retroactive Time Protection:** Event dates cannot be backdated prior to the current system timestamp.

---

## 4. Design System & Accessibility (A11y) Requirements

### 4.1 Aesthetic Philosophy: Modern SaaS & Academic Elegance
- **Strict Prohibition:** Absolutely **NO** exaggerated neon glowing borders, chaotic cyberpunk styling, illegible dark-mode low-contrast text, or gimmicky animations.
- **Tone:** Polished, contemporary academic SaaS (reminiscent of Linear, Notion, or Stripe Dashboard).
- **Visual Palette:**
  - **Primary Background:** Clean light zinc/slate (`#F8FAFC` or `#FFFFFF`) with crisp border definition (`#E2E8F0`).
  - **Dark Neutral Mode (if toggled):** Refined deep slate (`#0F172A` / `#1E293B`), not pure pitch black.
  - **Primary Accent / Brand:** Collegiate Navy / Royal Indigo (`#1E3A8A` or `#2563EB`) representing academic rigor.
  - **Semantic Accents:**
    - Success / Confirmed: Emerald (`#059669` / `#10B981`)
    - Warning / Closing Soon: Amber (`#D97706` / `#F59E0B`)
    - Danger / Closed / Full: Crimson / Rose (`#DC2626` / `#F43F5E`)
    - Informational / Chips: Slate / Zinc neutral scales

### 4.2 Typography & Readability
- **Font Stack:** Clean sans-serif system or web fonts (`Inter`, `Plus Jakarta Sans`, or system `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`).
- **Hierarchy:**
  - Display / Hero: 28px - 36px, Semi-Bold / Bold
  - Section Headings (H2/H3): 18px - 24px, Semi-Bold
  - Body Copy: 14px - 16px, Regular, 1.5 line height
  - Metadata / Micro-copy: 12px - 13px, Medium
  - Numerical Counters: `font-variant-numeric: tabular-nums` to prevent layout jitter on number changes.
- **Contrast Ratios:** All text elements strictly comply with **WCAG 2.1 AA** (minimum 4.5:1 contrast ratio against their immediate background; 3:1 for large display headers).

### 4.3 Component Polish & Micro-Interactions
- **Toast Notifications:**
  - Non-blocking notification stack at top-right or bottom-right.
  - Variants: `Success` (Green check), `Error` (Red exclamation), `Warning` (Amber alert), `Info` (Blue info).
  - Auto-dismisses after 3.5 seconds with pause-on-hover.
- **Interactive Button Affordances:**
  - Tactile states: Clear `:hover` brightness shift, `:active` slight scale down (`scale(0.98)`), and high-visibility `:focus-visible` ring.
  - Disabled states: `opacity-50`, `cursor-not-allowed`, and `aria-disabled="true"`.
- **Graceful Empty States:**
  - Filter with zero matches: Friendly icon, "No events found matching '[query]'", and a secondary "Reset All Filters" button.
  - "My Registrations" with zero sign-ups: "You haven't registered for any events yet. Explore upcoming hackathons and fests."

### 4.4 Accessibility (A11y) & Usability Standards
- **Keyboard Navigation:**
  - Full keyboard traversability (`Tab`, `Shift + Tab`).
  - Modals support `Escape` key dismissal.
  - Modals lock and trap focus within the active dialog when open.
- **ARIA Standards:**
  - Interactive modal dialogs carry `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - Dynamic capacity numbers and toast messages employ `aria-live="polite"`.
  - Icon-only buttons (close icons, bookmark toggles) include clear `aria-label` tags.

---

## 5. Architecture & State Management Strategy

### 5.1 Client-Side Application Architecture
To guarantee effortless local testing, lightning-fast response times, and zero setup friction for lab evaluations, the application operates as an autonomous, client-side single-page architecture:

```
[ Browser Client ]
       |
       +---> [ UI Layer: Components & Views ]
       |        |-- TopBar & Role Switcher
       |        |-- Student Dashboard (Hero, FilterMatrix, EventGrid)
       |        |-- Organizer Dashboard (Stats, Create/Edit Form, Ledger)
       |        |-- Modal Manager (Event Details, Roster Drawer)
       |        \-- Toast Notification Hub
       |
       +---> [ Reactive State Store ]
       |        |-- State: { events, registrations, currentRole, activeCategory, searchQuery }
       |        |-- Actions: registerEvent(), cancelRegistration(), createEvent(), updateEvent()
       |        \-- Selectors: getFilteredEvents(), getMyRegistrations(), getOrganizerMetrics()
       |
       +---> [ Storage Adapter (`localStorage`) ]
                |-- Key: `iiitm_events_v1`
                |-- Key: `iiitm_registrations_v1`
                |-- Key: `iiitm_active_role_v1`
                \-- Seed Fallback: IIIT Manipur Initial Data Fixture
```

### 5.2 Storage Schema & Data Models

#### 5.2.1 Event Model (`EventItem`)
```typescript
interface EventItem {
  id: string;                      // e.g. "ev-bytecraft-01"
  title: string;                   // e.g. "Manipur CodeSprint 2026"
  clubId: string;                  // e.g. "bytecraft"
  clubName: string;                // e.g. "ByteCraft - Coding Club"
  category: "Technical" | "Cultural" | "Workshop" | "Competition" | "Seminar";
  shortDescription: string;        // 1-2 sentence card summary
  fullDescription: string;         // Multi-paragraph detailed breakdown
  date: string;                    // ISO 8601 string: "2026-11-15T14:00:00"
  durationHours: number;           // e.g. 3
  venue: string;                   // e.g. "Computer Lab 3 (Web Tech Lab)"
  registrationDeadline: string;    // ISO 8601 string: "2026-11-14T23:59:59"
  maxCapacity: number;             // e.g. 60
  registeredCount: number;         // e.g. 42
  featured: boolean;               // Flag for Hero Banner
  tags: string[];                  // e.g. ["CP", "Algorithms", "DSA"]
  organizerEmail: string;          // e.g. "bytecraft@iiitmanipur.ac.in"
  bannerGradient: string;          // CSS gradient or color token for aesthetic card banner
}
```

#### 5.2.2 Registration Record (`RegistrationItem`)
```typescript
interface RegistrationItem {
  id: string;                      // Compound ID: `${eventId}__${studentId}`
  eventId: string;
  studentId: string;               // e.g. "2024-UG-CSE-042"
  studentName: string;             // e.g. "Aarav Sharma"
  studentEmail: string;            // e.g. "aarav.cse@iiitmanipur.ac.in"
  registeredAt: string;            // ISO 8601 string
  status: "CONFIRMED" | "CANCELLED";
}
```

### 5.3 Initial Seed Data (IIIT Manipur Campus Clubs Fixture)
If `localStorage` is empty or cleared, the application automatically seeds authentic campus data:

1. **ByteCraft (Coding & Software Development Club):**
   - *Event:* "Manipur CodeSprint 2026: Algorithmic Duel"
   - *Category:* Technical | *Venue:* Lab 3 | *Capacity:* 60 | *Featured:* True
2. **AeroKinetics (Robotics, IoT & Drones Club):**
   - *Event:* "Autonomous Quadcopter Workshop: Embedded ROS2"
   - *Category:* Workshop | *Venue:* Robotics Shed / Electronics Lab | *Capacity:* 40
3. **Tarang (Cultural, Music & Arts Society):**
   - *Event:* "Dhwani: Acoustic Evening & Open Mic"
   - *Category:* Cultural | *Venue:* Open Air Amphitheatre | *Capacity:* 250 | *Featured:* True
4. **E-Cell IIITM (Entrepreneurship & Innovation Cell):**
   - *Event:* "VentureForge: Northeast Startup Pitch Pitchfest"
   - *Category:* Competition | *Venue:* Academic Block Audi 1 | *Capacity:* 120
5. **LitDeb (Literary, Quizzing & Debating Society):**
   - *Event:* "The Senapati Parliamentary Debate League"
   - *Category:* Seminar | *Venue:* Seminar Hall 2 | *Capacity:* 50
6. **Apex Gaming & Esports Guild:**
   - *Event:* "Campus Valorant & BGMI Winter Championship"
   - *Category:* Competition | *Venue:* Virtual / Student Activity Center | *Capacity:* 64

### 5.4 Zero-Authentication Role Switcher
- **Implementation:** A persistent top-bar switcher with two distinct tabs:
  - `🎓 Student View` (Default: browse, filter, register, view My Registrations)
  - `🛠️ Club Organizer View` (Manage events, edit details, view live rosters, create new events)
- **Zero Friction:** No passwords, OTPs, or sign-in screens required. Evaluators and users can switch roles back and forth in one second, while event and registration state updates persist across role changes.

---

## 6. Edge Cases & Resilience Engineering

| Edge Case Scenario | System Behavior & Mitigation |
|---|---|
| **Last Seat Concurrency / Exhaustion** | If `registeredCount == maxCapacity`, "Register" action instantly turns disabled with badge `Sold Out`. Attempted registrations fail gracefully with informative toast. |
| **Past Deadline Registration** | If current system time surpasses `registrationDeadline`, registration triggers are disabled and labeled `Closed`. |
| **Reducing Capacity Below Registrations** | In the Organizer Edit modal, validation prevents setting `maxCapacity < registeredCount`. Clear inline error: *"Cannot set capacity to [N] because [X] students are already registered."* |
| **Corrupted / Invalid LocalStorage Data** | Storage manager wraps `JSON.parse` in try-catch. If corrupted data is encountered, it logs a warning, repairs the key, and re-seeds cleanly without crashing the UI. |
| **Self-Service Cancellation at Zero Count** | Decrement logic uses `Math.max(0, registeredCount - 1)` to prevent negative registration counts under any anomaly. |
| **Extreme Text Lengths** | Event titles and descriptions employ CSS text clamping (`line-clamp-2` for cards, `break-words` for modals) to prevent card overflow or visual breakage. |

---

## 7. Acceptance Criteria & Quality Checklist

- [ ] **Document Placement:** Specification file is saved at project root as `PROBLEM_STATEMENT.md`.
- [ ] **Executive Summary:** Clear context addressing IIIT Manipur's specific event fragmentation and registration pain points.
- [ ] **Dual Portals:** Clearly defined Student and Organizer roles with zero-auth role toggle.
- [ ] **Dashboard Features:** Featured hero banner, 5+ category filter tabs, debounced search, responsive grid, "My Registrations" view.
- [ ] **Event Modal:** Comprehensive metadata display with live capacity bar and dynamic registration CTA.
- [ ] **Registration Engine:** One-click toggle, duplicate prevention, cancellation support, dynamic count sync, deadline enforcement, `localStorage` persistence.
- [ ] **Organizer Suite:** Metric cards, create event form, edit event modal with capacity guards, live participant tracking.
- [ ] **Design & A11y:** Clean collegiate SaaS aesthetic (strictly NO neon/cyberpunk), WCAG AA contrast compliance, keyboard navigability, toast notifications, graceful empty states.
- [ ] **Seed Data:** Pre-configured authentic IIIT Manipur clubs and events.
