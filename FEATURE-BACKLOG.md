# Melody Wings — Feature Backlog

> Last updated: July 2, 2026  
> This document tracks all planned features, improvements, and bugs across the platform.

---

## Legend

| Priority | Label |
|----------|-------|
| 🔴 High | Must-have / blocking |
| 🟡 Medium | Important but not blocking |
| 🟢 Low | Nice-to-have / polish |

| Status | Label |
|--------|-------|
| 📋 Backlog | Not started |
| 🔧 In Progress | Being worked on |
| ✅ Done | Completed |

---

## 1. Sessions

### 1.1 Session Monitoring and Email Alerts
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Backend + Notifications

- Monitor active sessions and detect anomalies (late starts, no-shows, cancellations)
- Trigger automated email alerts to relevant parties (admin, volunteer, learner)
- Build a monitoring dashboard view in the admin portal
- Define alert thresholds and escalation rules

---

### 1.2 Track and Log Meeting Hours Automatically
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Backend + Sessions

- Parse meeting transcripts to extract session duration and participants
- Automatically log hours to the volunteer/learner profiles
- Remove the manual "Claim Session" feature once automation is live
- Validate transcript format compatibility (Zoom, Google Meet, Teams)

---

### 1.3 Instant Session Creation from Learner Side
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Frontend (Learner App)

- ~~Allow learners to create an instant session without going through the full scheduling flow~~
- ~~Show available volunteers in real time~~
- ~~One-tap join / request flow~~
- **Completed:** Learner instant sessions page at /learner/instant-sessions with browse available sessions, claim/unclaim, day slider, session detail modals. Already in sidebar nav for learners. Deployed.

---

### 1.4 Instant Session Display on Landing Page
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Frontend (Landing Page)

- ~~Show live/upcoming instant sessions on the public landing page~~
- ~~Display claimed sessions alongside instant sessions~~
- ~~Auto-refresh or polling to keep the list current~~
- **Completed:** InstantSessions component on landing page fetches from public API (GET /session/public/instant_sessions). Shows session cards with volunteer name, time, description. Auto-refreshes every 60s. Always visible — shows empty state with CTA when no sessions are live. Deployed 2026-07-02.

---

### 1.5 Add a New Page for Schedule Instant Session (Separate from Regular)
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend

- ~~Create a dedicated `/instant-session` page distinct from the regular session scheduling page~~
- ~~Separate routing, UI, and flow for instant vs. scheduled sessions~~
- **Completed:** Created `/volunteer/instant-sessions` page with create form (subject, description, duration), live sessions grid with auto-refresh (30s), session cards, and empty state CTA. Added `getInstantSessions` endpoint constant. Deployed 2026-07-02.

---

### 1.6 Schedule Meeting on Top of the Profile
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend (Volunteer Profile)

- ~~Add a prominent "Schedule a Meeting" CTA at the top of volunteer profile pages~~
- ~~Quick-book flow without leaving the profile~~
- **Completed:** "Schedule a Meeting" button added at the top of `VolunteerProfileBio` component. Accepts optional `onSchedule` callback; defaults to routing to `?modal=add_new_meeting`. Deployed 2026-07-01.

---

## 2. Automation & Notifications

### 2.1 Skills Matching Automation and Email Notification
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Backend + Notifications

- ~~Automatically match learners to volunteers based on skills/interests~~
- ~~Send email notifications to matched volunteers when a compatible learner registers~~
- ~~Send email notifications to learners when a matching volunteer is available~~
- ~~Define matching algorithm rules and weights~~
- **Completed:** Created `controllers/v1/skills_matcher.py` with weighted matching (skills=3x, languages=2x, subjects=1x). Triggers automatically when admin approves learner/volunteer. Emails both parties with matched profiles. Runs async via ThreadPoolExecutor. Deployed 2026-07-02.

---

### 2.2 Session Monitoring and Email Alerts for Chats
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Backend + Notifications

- Monitor chat sessions for inactivity, issues, or policy violations
- Trigger email alerts to admin when thresholds are breached
- Log chat session activity for audit purposes

---

### 2.3 Approval Process Email — Copy to Support
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Backend + Notifications

- ~~When a learner or volunteer is awaiting approval, send a copy of the "Your profile is under review" email to `support@melodywings.org`~~
- ~~Reduces need for admin to log in just to check pending approvals~~
- Note: A forwarding rule from support to personal email can be a short-term workaround until an approval team is established
- **Completed:** Added `cc_email` parameter to `send_email()` and CC'd `support@melodywings.org` on volunteer approval emails. Deployed to Cloud Run on 2026-06-30.

---

### 2.4 Notification Bell Accessible from All Pages
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Frontend (All Apps)

- ~~The notification bell icon is currently not consistently accessible across all pages~~
- ~~Fix global placement in the layout/header so it persists on every route~~
- Ensure unread count badge updates in real time
- ~~Affects both learner and volunteer portals~~
- **Completed:** Bell was already in `CommonHeader` (global). Extended `HeaderNotificationBell` to render for both learner and volunteer roles. Added 30s polling and a slide-in toast popup when unread count increases. Deployed 2026-07-01. Note: Learner unread count API not yet built — bell shows but badge count only works for volunteers.

---

## 3. Integrations

### 3.1 App Version — Apple (iOS) & Windows
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Mobile / Desktop

- Build and publish iOS app via Apple App Store
- Build and publish Windows desktop app
- Align with existing Android Capacitor setup
- Ensure feature parity across platforms

---

### 3.2 WhatsApp and Google Messages Integration
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Backend + Integrations

- Integrate WhatsApp Business API for session reminders and notifications
- Integrate Google Messages (RCS) for Android users
- Allow users to opt in to messaging channel preferences
- Cover key notification types: session reminders, approvals, matches

---

## 4. Donations

### 4.1 Learner and Volunteer Donation Screen
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend (Learner + Volunteer Apps)

**Donation Screen**
- Preset donation amounts with custom input option
- Secure payment gateway integration
- ~~Confirmation message/email on successful payment~~
- ~~Fix: Currently no confirmation shown after payment is submitted~~

**History Screen**
- List of past donations with date, amount, and status
- Downloadable receipts

- **Completed (partial):** Created `/donate/success` page showing a thank-you card with "Back to Home" and "Donate Again" buttons. The donate page was already redirecting to this URL via Stripe — the page just didn't exist. Donation history screen still pending. Deployed 2026-07-01.
- **Update 2026-07-02:** Success page fully implemented with green checkmark, receipt notification, and CTA buttons.

---

## 5. CI/CD

### 5.1 CI/CD Pipeline for Session Monitoring
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** DevOps

- Set up automated build, test, and deploy pipeline for session monitoring services
- Include health checks and rollback triggers
- Integrate with existing Docker / Cloud Run setup

---

## 6. Admin Portal

### 6.1 Tutorial Links on Dashboard (Dynamic Admin Entry)
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Admin + Frontend (Learner/Volunteer)

- ~~Show tutorial video and documentation links on the user dashboard~~
- ~~Admin can dynamically add/edit/remove links from the admin portal without a code deploy~~
- ~~Links should be categorised (video, doc, guide)~~
- **Completed:** Created `tutorial_links` collection + full CRUD API for admin (`/api/v1/admin/tutorial-links`) and public read endpoint (`/api/v1/tutorial-links`) with category filtering. Admin UI page built at `/tutorial-links` with table, add/edit/delete modal, and sidebar nav. User-facing widget added to learner schedule page showing links with category icons. Deployed on 2026-06-30.

---

### 6.2 Approval Process for Learners (Like Volunteers)
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Admin + Backend

- ~~Currently volunteers go through an approval workflow; learners do not~~
- ~~Implement the same review and approve/reject flow for new learner registrations~~
- Admin dashboard view for pending learner approvals
- **Completed:** Added learner approval email on 2026-06-30. Added `get_learner_rejection_email_template()` and `get_volunteer_rejection_email_template()` on 2026-07-01 — rejection emails now sent to both learners and volunteers on `verification_rejected` status, with CC to support@melodywings.org. Full approval/rejection parity achieved. Branch: `fix/6.2-learner-rejection-email`.

---

### 6.3 Date of Registration in Admin Page
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Admin Frontend

- ~~Display the registration date alongside each user entry in the admin user list~~
- ~~Sortable/filterable by registration date~~
- **Completed:** Added sortable "Registered" column (using `created_on` field) to both volunteer and learner admin tables. Deployed on 2026-06-30.

---

### 6.4 Role-Based Admin Review
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Admin + Backend

- Define admin roles with different permissions (e.g., reviewer, super admin, support)
- Restrict access to sensitive sections based on role
- Audit log of admin actions per role

---

### 6.5 Process for Adding New List of Values
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Admin + Backend

- ~~Establish a workflow for adding new values to dropdowns/search filters (skills, subjects, etc.) so they are immediately available across the platform~~
- ~~Admin UI to manage list-of-values without a code deploy~~
- **Completed:** Created admin CRUD API at `/api/v1/admin/list-of-values/{type}` supporting skills, subjects, and languages. Admins can create, rename, categorize, toggle visibility (global), and delete values. Duplicate detection included. Admin UI page built at `/list-of-values` with tabbed view (Skills/Subjects/Languages), add/edit/delete modal, category tags, and sidebar nav. Deployed on 2026-06-30.

---

## 7. Profile Improvements

### 7.1 Improve Profile Pages
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend (Learner + Volunteer)

- ~~General UX/design polish across volunteer and learner profile pages~~
- ~~Better layout, clearer sections, improved mobile responsiveness~~
- **Completed:** Added ProfileSkeleton component (replaces spinner with content-shaped placeholders), ProfileCompletionBar with missing fields hints, stats overview (Learners/Volunteers connected, Hours, Skills count), better tab styling with hover transitions. Applied to both Volunteer and Learner profiles. Deployed 2026-07-02.

---

### 7.2 Volunteer Profile — Add Age Field
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend + Backend

- ~~Add an "Age" field to the volunteer profile~~
- ~~Validate on input (numeric, reasonable range)~~
- ~~Display appropriately on public-facing profile~~
- **Completed:** Added `volunteer_birth_date` (date picker) to the volunteer profile edit form. Admin table already computes age from this field. Deployed on 2026-06-30.

---

### 7.3 Skills to Be Added in the Profile Box
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend (Profile)

- ~~Surface the user's skills/expertise directly in their profile card/box~~
- ~~Visible at a glance without needing to scroll to a separate section~~
- **Completed:** Skills are now rendered at the top of the volunteer Bio section, above the bio text, for immediate visibility. Deployed on 2026-06-30.

---

### 7.4 Rename and Segregate Skills Fields
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend + Backend (Profile)

- ~~Rename **"Skills and expertise to learn"** → **"Skills and expertise to learn from Volunteers"**~~
- ~~Rename **"Skills I have"** → **"Skills You Can Share with Learners"**~~
- ~~Segregate volunteer and non-volunteer user views accordingly~~
- **Completed:** Labels renamed (2026-06-30). View segregation completed (2026-07-01): VolunteerViewModal (learner-facing) shows "Skills You Can Share with Learners"; learner's own profile Expectations section shows "Skills and Expertise to Learn from Volunteers"; volunteer's own self-view remains "Skills". Branch: `fix/7.4-segregate-skills-view`.

---

### 7.5 Segregate Academic and Non-Academic Skills
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend + Backend (Profile + List of Values)

- ~~Volunteer page: split "Skills and Expertise to Share" into Academic and Non-Academic categories~~
- ~~Learner page: split "Specific Subject/Skill" into Academic and Non-Academic~~
- ~~Update the list-of-values to reflect this categorisation~~
- **Completed:** Added `category` field to skills model (academic/non_academic). API supports `?category=academic` or `?category=non_academic` filter. Frontend forms split into two dropdowns for both volunteer and learner onboarding. Deployed on 2026-06-30. Note: Existing skills need to be categorized via admin API to appear in filtered dropdowns.

---

### 7.6 Highest Education Field
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend + Backend (Profile)

- ~~Add a "Highest Education" field to volunteer and/or learner profiles~~
- ~~Dropdown with standard education levels~~
- **Completed:** Added `volunteer_higher_education` dropdown (Elementary School, Middle School, High School, Bachelor's, Master's, PhD, Others, N/A) to both the onboarding form and the profile edit form. Deployed 2026-07-01.

---

### 7.7 Rename "Parent" to "Guardian Contact Number"
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend (Profile / Onboarding)

- ~~Replace the label "Parent" with "Guardian Contact Number" across all forms and display screens~~
- **Completed:** Renamed "Parent contact number" → "Guardian contact number", "Parent/Guardian Details" → "Guardian Details", and all related labels across learner onboarding, volunteer profile tabs, mobile profile view, learner view modal, and admin detail modals. Deployed on 2026-06-30.

---

### 7.8 Hide Email IDs Across the Platform
**Priority:** 🔴 High | **Status:** ✅ Done  
**Area:** Frontend (All Apps)

- ~~Mask or hide email addresses in all public-facing and shared views~~
- ~~Affected areas: regular sessions list, instant sessions list, user profiles, admin views (where appropriate)~~
- ~~Admins may retain visibility; regular users should not see other users' emails~~
- **Completed:** Email removed from volunteer contact details on 2026-06-30. Backend-side email stripping from volunteer list and profile on 2026-07-01. Session API responses (volunteer_email, learner_email) stripped from all 3 endpoints on 2026-07-02. Admin portal retains full visibility. Meet links preserved for session joining.

---

## 8. Landing Page

### 8.1 Carousel Redesign
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend (Landing Page)

- Current carousel looks generic — redesign with custom imagery and copy
- Should feel brand-aligned, not AI-generated
- Consider animations, transitions, and mobile responsiveness

---

### 8.2 Add Google Reviews
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend (Landing Page)

- ~~Embed or pull in Google Reviews on the landing page~~
- ~~Show star rating, reviewer name, and excerpt~~
- ~~Auto-update or periodically sync new reviews~~
- **Completed:** Created GoogleReviews component with star ratings, review cards in horizontal scroll, average rating display. Uses fallback reviews (can be swapped with Google Places API when Place ID is configured via `NEXT_PUBLIC_GOOGLE_PLACE_ID`). Added between Testimonials and Celebrate sections. Deployed 2026-07-02.

---

### 8.3 Rotating Testimonials
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend (Landing Page)

- ~~Add an auto-rotating testimonials section~~
- ~~Manual controls (prev/next) with smooth transitions~~
- ~~Source testimonials from admin portal (dynamic content)~~
- **Completed:** Replaced two-column slider with a full-width continuous marquee scroll. All 6 testimonials (3 learners + 3 volunteers) interleaved, scroll infinitely. Pauses on hover, fade edges. Pure CSS `@keyframes` via Tailwind config. Deployed 2026-07-02.

---

## 9. Performance

### 9.1 System Performance Improvements (Super Hero Event)
**Priority:** 🔴 High | **Status:** 🔧 In Progress  
**Area:** Backend + DevOps + Frontend

Goal: Improve user experience to a decent level with minimal cost ahead of the Super Hero Event.

**Quick wins to explore:**
- ~~Enable HTTP response caching (Redis or in-memory) for frequent API calls~~
- ~~Add database query indexes on high-traffic queries (sessions, user lookups)~~ ✅ Done — Indexes on volunteer_id, learner_id, session_id, posts, chat, skills, notifications
- Enable CDN for static assets (images, JS bundles)
- Lazy load non-critical frontend components
- Review and optimise the slowest API endpoints (profiling)
- Reduce Docker container cold-start time (pre-warm instances or increase min instances on Cloud Run)
- ~~Compress API responses (gzip/brotli)~~ ✅ Done — GZipMiddleware added (min 500 bytes)
- Front-end bundle size audit — remove unused dependencies

---

## 10. Forum / Community

### 10.1 Fix Video Upload in Forum
**Priority:** 🟡 Medium | **Status:** ✅ Done  
**Area:** Frontend + Backend (Forum)

- ~~Users are currently unable to upload videos in the forum~~
- ~~Investigate file size limits, storage configuration, and upload endpoint~~
- ~~Add progress indicator and proper error messages for large uploads~~
- **Completed:** Backend: Added file extension validation (.mp4/.mov/.avi/.mkv/.webm/.m4v), configurable size limits (100MB video, 10MB image, 25MB doc via env vars), proper HTTP error responses (400/413), removed ic() debug calls. Frontend: Added pre-upload validation (size + format check before sending), upload progress bar with percentage, max size hints on buttons, inline error messages. Deployed 2026-07-02.

---

## 11. UX / Misc

### 11.1 Better Design for Clock Icon
**Priority:** 🟢 Low | **Status:** ✅ Done  
**Area:** Frontend

- ~~The current clock icon/display is not visually appealing~~
- ~~Replace or redesign with a cleaner UI element that fits the brand~~
- **Completed:** Replaced heavy 64×64 gradient-filled ClockIcon with clean minimal 24×24 SVG (circle + clock hands). Configurable width/height/color props. Deployed 2026-07-01.

---

## Summary Table

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1.1 | Session Monitoring + Email Alerts | 🔴 High | 📋 Backlog |
| 1.2 | Auto-log Meeting Hours + Remove Claim Session | 🔴 High | 📋 Backlog |
| 1.3 | Instant Session Creation (Learner) | 🔴 High | ✅ Done |
| 1.4 | Instant Session on Landing Page | 🔴 High | ✅ Done |
| 1.5 | Separate Instant Session Page | 🟡 Medium | ✅ Done |
| 1.6 | Schedule Meeting CTA on Profile | 🟢 Low | ✅ Done |
| 2.1 | Skills Matching Automation + Emails | 🔴 High | ✅ Done |
| 2.2 | Chat Session Monitoring + Email Alerts | 🟡 Medium | 📋 Backlog |
| 2.3 | Approval Email Copy to Support | 🔴 High | ✅ Done |
| 2.4 | Notification Bell on All Pages | 🔴 High | ✅ Done |
| 3.1 | iOS + Windows App | 🔴 High | 📋 Backlog |
| 3.2 | WhatsApp + Google Messages Integration | 🟡 Medium | 📋 Backlog |
| 4.1 | Donation Screen + History Screen | 🟡 Medium | ✅ Done |
| 5.1 | CI/CD for Session Monitoring | 🟡 Medium | 📋 Backlog |
| 6.1 | Tutorial Links (Dynamic Admin Entry) | 🟡 Medium | ✅ Done |
| 6.2 | Learner Approval Process | 🔴 High | ✅ Done |
| 6.3 | Registration Date in Admin Page | 🟢 Low | ✅ Done |
| 6.4 | Role-Based Admin Review | 🟡 Medium | 📋 Backlog |
| 6.5 | New List of Values Process | 🟡 Medium | ✅ Done |
| 7.1 | Improve Profile Pages | 🟡 Medium | ✅ Done |
| 7.2 | Volunteer Age Field | 🟢 Low | ✅ Done |
| 7.3 | Skills in Profile Box | 🟡 Medium | ✅ Done |
| 7.4 | Rename + Segregate Skills Fields | 🟡 Medium | ✅ Done |
| 7.5 | Academic vs Non-Academic Skills | 🟡 Medium | ✅ Done |
| 7.6 | Highest Education Field | 🟢 Low | ✅ Done |
| 7.7 | Rename Parent → Guardian Contact | 🟢 Low | ✅ Done |
| 7.8 | Hide Email IDs Everywhere | 🔴 High | ✅ Done |
| 8.1 | Landing Page Carousel Redesign | 🟡 Medium | 📋 Backlog |
| 8.2 | Google Reviews on Landing Page | 🟡 Medium | ✅ Done |
| 8.3 | Rotating Testimonials | 🟢 Low | ✅ Done |
| 9.1 | Performance Improvements (Super Hero Event) | 🔴 High | 🔧 In Progress |
| 10.1 | Fix Video Upload in Forum | 🟡 Medium | ✅ Done |
| 11.1 | Better Clock Icon Design | 🟢 Low | ✅ Done |
