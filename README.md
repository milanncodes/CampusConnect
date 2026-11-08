# CampusConnect | IIIT Manipur Campus Event Management Platform

An enterprise-grade, accessible single-page web platform designed and engineered for the **Indian Institute of Information Technology Senapati, Manipur (IIIT Manipur)** to eliminate campus event fragmentation, automate seat capacity enforcement, and provide instant self-service event registration.

Built for **Web Design Sprint 2026** addressing **Problem Statement 01: Campus Event Hub**.

---

## 1. Quick Start & Local Run Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v24)
- npm (v9.0.0 or higher)

### 1-Command Execution
```bash
npm install && npm run build && npm run preview
```

The application will build with TypeScript verification and start a local production preview server at:
```
http://localhost:3000/
```

### Development Mode
```bash
npm run dev
```

---

## 2. Core Architecture & Technology Stack

| Layer | Technology | Engineering Purpose |
|---|---|---|
| **UI Framework** | React 18 (`react`, `react-dom`) | Declarative, component-driven reactive interface |
| **Language** | TypeScript 5.7+ | Strict compile-time typing with zero `any` usage |
| **Styling & Design System** | Tailwind CSS 3.4 | Utility-first, semantic color palette meeting WCAG 2.1 AA |
| **Icons** | Lucide React | Consistent, accessible iconography |
| **Build Tool & Bundler** | Vite 6 | Lightning-fast HMR and optimized production treeshaking |
| **State & Persistence** | React Context + `localStorage` | Pure client-side persistence with robust in-memory fallbacks |

---

## 3. Evaluation Rubric Alignment (100 Marks Total)

### Criteria 1: Visual Design & Aesthetics (30 Marks)
- **High-Contrast Palette:** Slate and white background foundation paired with collegiate indigo accents (`#4338CA`) and accessible semantic colors (Emerald confirmed, Amber near-capacity, Rose sold-out).
- **Accessible Badge Architecture:** 5-tier semantic pastel category badges with distinct high-contrast border outlines:
  - Technical: `bg-blue-50 text-blue-700 border border-blue-200`
  - Cultural: `bg-purple-50 text-purple-700 border border-purple-200`
  - Workshop: `bg-amber-50 text-amber-800 border border-amber-200`
  - Competition: `bg-rose-50 text-rose-700 border border-rose-200`
  - Seminar: `bg-emerald-50 text-emerald-700 border border-emerald-200`
- **Typography & Layout Alignment:** Clean font hierarchy with tabular numerical formatting (`tabular-nums`) to prevent layout shifts on dynamic counters.
- **Micro-Interactions:** Tactile button states (`active:scale-[0.98]`), subtle card elevation on hover (`hover:-translate-y-1 hover:shadow-lg`), and custom sleek scrollbars.

### Criteria 2: User Experience & Navigation (25 Marks)
- **Spotlight Search (`Ctrl + K` / `Cmd + K`):** Global command palette allowing fuzzy search across titles, clubs, venues, and categories with full keyboard navigation (arrows, Enter, Esc).
- **Executive Telemetry Banner:** Real-time summary cards displaying open events, active student registrations, and campus domain counts.
- **Graceful Empty States:** Contextual empty states with clear error descriptions and a 1-click "Clear filters" restore action.
- **Non-blocking Toast Hub:** Toast notification dispatch for instant feedback on registration, cancellation, capacity saturation, and event modifications.
- **Safety Prompts:** Two-step confirmation safeguards when releasing an RSVP or deleting a club event.

### Criteria 3: Functionality & Implementation (20 Marks)
- **Atomic Registration Engine:**
  - One-click registration and self-service cancellation toggle.
  - Strict duplicate registration prevention keyed by student identity.
  - Real-time capacity counter synchronization (`registeredCount / capacity`).
  - Deadline cutoff enforcement against system timestamps.
- **Organizer CRUD Lifecycle:**
  - Full modal form to create new campus events or edit existing events.
  - Enforced **Capacity Floor Guardrail**: prevents organizers from setting capacity lower than active registered participants.
  - Date validation ensuring registration deadlines cannot exceed event dates.
  - Cascading deletion: deleting an event automatically purges student schedule references.
- **Persistent Storage Adapter:** Robust `try/catch` wrapper over `localStorage` that seamlessly operates even in private/incognito browsing windows.

### Criteria 4: Creativity & Domain Realism (15 Marks)
- **Authentic IIIT Manipur Context:** Pre-seeded with genuine campus student bodies:
  - *ByteCraft* (Coding & Dev Club)
  - *CyberSec Guild IIITM* (Cybersecurity & CTF)
  - *AeroKinetics* (Robotics & Drones)
  - *Tarang* (Cultural Society)
  - *E-Cell IIITM* (Entrepreneurship Cell)
  - *IIITM ACM Student Chapter*
- **Digital Student Access Pass:** Verified credential card with individualized QR codes and unique registration identifiers (`IIITM-EVT-<ID>-2026`).
- **Standardized Calendar Export (`.ics`):** One-click generation and download of RFC-compliant `.ics` files for Google Calendar, Outlook, and Apple Calendar.
- **Schedule Conflict Detector:** Highlights an alert on event cards if a student already has another event booked on that calendar day.
- **Evaluator Controls:** Low-profile floating toolbar with 1-click "Simulate Max Capacity" and "Reset Seed Data" (`Ctrl + Shift + R`).

### Criteria 5: Responsive Design (10 Marks)
- **Adaptive Grid Breakpoints:** Fluid reflow from 1 column on mobile (< 640px), 2 columns on tablet (768px), and 3 columns on desktop (1024px+).
- **Touch-Optimized Mobile Drawer:** Mobile navigation drawer with minimum 44x44px touch targets.
- **Horizontal Category Scroll:** Smooth touch scrolling (`no-scrollbar`) for filter pills on smaller viewports.
- **Mobile-Responsive Data Ledger:** Organizer table wrapped in an `overflow-x-auto` container with `min-w-[760px]` and sticky column headers.
- **Single-Column Modal Stack:** Event Details dialog automatically transitions from a 2-column grid to a single-column stack on mobile with sticky thumb-accessible action buttons.

---

## 4. Institutional Profile & Zero-Auth Evaluator Mode

To facilitate rapid grading and evaluation without authentication roadblocks:
- **Student Profile:** Pre-configured as **Aarav Sharma** (B.Tech CSE, Roll: `240101042`).
- **Zero-Authentication Role Switcher:** Toggle between **Student View** and **Organizer Portal** in the navigation bar with immediate state retention.

---

## 5. Keyboard Navigation Reference

| Key Combo | Action |
|---|---|
| `Ctrl + K` or `Cmd + K` | Open Spotlight Search & Command Palette |
| `Tab` / `Shift + Tab` | Accessible keyboard focus traversal |
| `Escape` | Dismiss any open modal dialog or search palette |
| `Ctrl + Shift + R` | Reset all platform state to pristine initial seed fixtures |

---

## 6. Verification Status

- **TypeScript Compilation:** Strict check passed (`tsc --noEmit`) with 0 errors.
- **Vite Production Bundler:** Production bundle built cleanly with optimized chunking.
- **Accessibility:** WCAG 2.1 AA compliant color contrast and ARIA dialog semantics.
