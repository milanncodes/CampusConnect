# CampusConnect | 3-Minute Live Judging & Evaluation Walkthrough Script
**Institution:** Indian Institute of Information Technology Senapati, Manipur (IIIT Manipur)  
**Event:** Web Design Sprint 2026  
**Platform Architecture:** React + TypeScript + Tailwind CSS + Lucide Icons (Zero-Auth Instant Evaluator Switcher)

---

## Evaluation Overview Matrix
| Criterion | Tested Capability | Key Validation Indicator |
|---|---|---|
| **Discovery & Search** | Real-time multi-attribute search, 5-tier category filters & Spotlight (`Ctrl+K`) | Zero-delay filtering across title, venue, tags & clubs |
| **Registration Engine** | One-click RSVP toggle with capacity & deadline safeguards | Instant digital pass generation & optimistic synchronization |
| **Organizer Operations** | Live telemetry, capacity floor guardrails, CRUD lifecycle | Cannot reduce capacity below registered student count |
| **Accessibility (A11y)** | WCAG 2.1 AA standards, high-contrast palette, focus traps | Full keyboard traversability (`Tab`, `Esc`, focus rings) |
| **State Resilience** | `localStorage` persistence with seed fixture fallback | Persistent state across tabs, instant `Ctrl+Shift+R` reset |

---

## 3-Minute Live Demonstration Script

### Minute 1:00 — Introduction & Student Discovery

#### Presenter Action:
1. Open the application at `http://localhost:3000/`.
2. Point out the top **Navbar** with the IIIT Manipur branding, the active profile badge for **Aarav Sharma** (`240101042`), and the **Executive Stats Banner**.

#### Speaking Script:
> *"Good morning, respected judges. In an institute like IIIT Manipur, event discovery is traditionally fragmented across WhatsApp groups, Telegram channels, and opaque Google Forms that frequently overbook sessions.*
>
> *Here is **CampusConnect**, an enterprise-grade campus event management platform built specifically for IIIT Manipur. Notice our **Executive Stats Banner** right below the sticky navigation bar: it dynamically computes open events, my active registrations, and active category domains with zero latency and high-contrast WCAG 2.1 AA compliant typography.*
>
> *On the **Featured Spotlight Hero**, students instantly see our marquee event — 'Web Design Sprint 2026' — with full schedule chips and immediate registration status."*

#### Interactive Flow:
- Hit `Ctrl + K` to open the **Spotlight Search Palette**.
  - Type `CTF` and use the arrow keys to select the *Northeast Cyber Defense CTF Challenge*. Press Enter.
- Click the **Category Pills**: `Technical`, `Cultural`, `Workshop`, `Competition`, `Seminar`.
  - Notice the semantic pastel styling with deep contrasting borders and real-time count badges.
- Use the **Sort Dropdown** to sort by *Popularity / Fill Rate* or *Closing Soon*.

---

### Minute 1:45 — One-Click Registration Engine & Digital Pass

#### Presenter Action:
1. Locate any open event (e.g. *Hands-on PyTorch Workshop* or *Northeast Cyber Defense CTF Challenge*).
2. Click **View Details** to open the **Event Details Modal**.

#### Speaking Script:
> *"When a student opens an event, they are presented with a dialog implementing a full accessible focus trap and Escape-key listener.*
>
> *On the right, notice the **Live Capacity Tracker**: it highlights exact occupied seats and remaining spots with an animated progress meter that shifts from emerald to amber, and finally rose as capacity reaches 100%.*
>
> *With a single click on **'Confirm Registration'**, the registration engine atomically executes: increments the seat counter, records the student ID, persists the state to browser storage, and immediately generates a verified **Digital Student Access Pass** with an individualized QR code for venue entry.*
>
> *Students can also click **'Add to Calendar (.ics)'** to export the event directly to Google Calendar or Apple Calendar, or click **'View Pass'** to open a print-ready credential card."*

#### Interactive Flow:
- Click **"Confirm Registration"**.
  - Toast notification appears, the header switches to an emerald confirmation banner showing Aarav Sharma's details, and the Digital Access Pass is rendered.
- Click **"Add to Calendar (.ics)"** to demonstrate standard `.ics` generation.
- Click **"Cancel My Registration"**.
  - Notice the safety prompt: *"Release your seat? Yes, Release / Keep Spot"*. Confirm release: count decrements and seats are restored.

---

### Minute 2:30 — Zero-Auth Role Switcher & Organizer Operations

#### Presenter Action:
1. In the top navigation bar, toggle the segmented pill switch from **"Student View"** to **"Organizer Portal"**.

#### Speaking Script:
> *"During evaluations or campus demonstrations, mandatory sign-in walls create unnecessary friction. With our **Zero-Authentication Role Switcher**, evaluators can seamlessly toggle into the **Club Organizer Portal** in one second without losing application state.*
>
> *Notice our organizer overview:*
> 1. *Live club telemetry displaying active events, total registered attendees across campus, and average seat fill ratios.*
> 2. *The **Campus Event Ledger** allows club coordinators to filter by organizing club — such as ByteCraft, AeroKinetics, or Tarang.*
> 3. *Let's test an essential safety guardrail: when editing an event with 64 registered students, if we attempt to lower capacity to 50, our capacity floor guardrail immediately halts the update and informs the organizer.*
> 4. *Clicking **'+ Create New Event'** opens our validated publishing modal with pre-configured campus venues and curated photography presets."*

#### Interactive Flow:
- Click **"Edit"** on *Web Design Sprint 2026* (which has 64 registered students).
  - Attempt to change capacity to `40` and click **Save Changes**.
  - Form validation blocks submission with error: *"Cannot set capacity to 40. There are already 64 registered students."*
  - Set capacity to `90` and save: Success toast confirms update.
- Demonstrate **Delete Protection**:
  - Click the Trash icon on an event row.
  - Notice the inline two-step confirmation (*"Sure? Yes / No"*) preventing accidental deletions.

---

### Minute 3:00 — Edge-Case Hardening & Demo Controls

#### Presenter Action:
1. Point to the floating **"Judge Controls"** toolbar at the bottom-left.

#### Speaking Script:
> *"Finally, we engineered dedicated evaluation controls for our judges:*
> - *Clicking **'Simulate Max Capacity'** saturates an event to 100% capacity instantly, demonstrating the disabled 'At Capacity' state.*
> - *Pressing **Ctrl + Shift + R** or clicking **'Reset Seed Data'** instantaneously restores our pristine 8-event IIIT Manipur initial fixtures.*
> - *The entire platform runs client-side with persistent localStorage, zero runtime dependencies, and passes WCAG 2.1 AA accessibility checks.*
>
> *Thank you, judges! We welcome your questions."*

---

## Quick Reference Keyboard Shortcuts
- `Ctrl + K` / `Cmd + K`: Spotlight Search command palette.
- `Tab` / `Shift + Tab`: Full focus traversal through all interactive elements.
- `Escape`: Instantly close any open modal (Event Details, Event Form, or Spotlight).
- `Ctrl + Shift + R` (or `Cmd + Shift + R`): Reset platform to clean initial seed data fixtures.
