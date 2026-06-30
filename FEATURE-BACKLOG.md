# Melody Wings — Feature Backlog

> Last updated: June 30, 2026  
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
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Frontend (Learner App)

- Allow learners to create an instant session without going through the full scheduling flow
- Show available volunteers in real time
- One-tap join / request flow

---

### 1.4 Instant Session Display on Landing Page
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Frontend (Landing Page)

- Show live/upcoming instant sessions on the public landing page
- Display claimed sessions alongside instant sessions
- Auto-refresh or polling to keep the list current

---

### 1.5 Add a New Page for Schedule Instant Session (Separate from Regular)
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend

- Create a dedicated `/instant-session` page distinct from the regular session scheduling page
- Separate routing, UI, and flow for instant vs. scheduled sessions

---

### 1.6 Schedule Meeting on Top of the Profile
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend (Volunteer Profile)

- Add a prominent "Schedule a Meeting" CTA at the top of volunteer profile pages
- Quick-book flow without leaving the profile

---

## 2. Automation & Notifications

### 2.1 Skills Matching Automation and Email Notification
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Backend + Notifications

- Automatically match learners to volunteers based on skills/interests
- Send email notifications to matched volunteers when a compatible learner registers
- Send email notifications to learners when a matching volunteer is available
- Define matching algorithm rules and weights

---

### 2.2 Session Monitoring and Email Alerts for Chats
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Backend + Notifications

- Monitor chat sessions for inactivity, issues, or policy violations
- Trigger email alerts to admin when thresholds are breached
- Log chat session activity for audit purposes

---

### 2.3 Approval Process Email — Copy to Support
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Backend + Notifications

- When a learner or volunteer is awaiting approval, send a copy of the "Your profile is under review" email to `support@melodywings.org`
- Reduces need for admin to log in just to check pending approvals
- Note: A forwarding rule from support to personal email can be a short-term workaround until an approval team is established

---

### 2.4 Notification Bell Accessible from All Pages
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Frontend (All Apps)

- The notification bell icon is currently not consistently accessible across all pages
- Fix global placement in the layout/header so it persists on every route
- Ensure unread count badge updates in real time
- Affects both learner and volunteer portals

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
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend (Learner + Volunteer Apps)

**Donation Screen**
- Preset donation amounts with custom input option
- Secure payment gateway integration
- Confirmation message/email on successful payment
- Fix: Currently no confirmation shown after payment is submitted

**History Screen**
- List of past donations with date, amount, and status
- Downloadable receipts

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
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Admin + Frontend (Learner/Volunteer)

- Show tutorial video and documentation links on the user dashboard
- Admin can dynamically add/edit/remove links from the admin portal without a code deploy
- Links should be categorised (video, doc, guide)

---

### 6.2 Approval Process for Learners (Like Volunteers)
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Admin + Backend

- Currently volunteers go through an approval workflow; learners do not
- Implement the same review and approve/reject flow for new learner registrations
- Admin dashboard view for pending learner approvals

---

### 6.3 Date of Registration in Admin Page
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Admin Frontend

- Display the registration date alongside each user entry in the admin user list
- Sortable/filterable by registration date

---

### 6.4 Role-Based Admin Review
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Admin + Backend

- Define admin roles with different permissions (e.g., reviewer, super admin, support)
- Restrict access to sensitive sections based on role
- Audit log of admin actions per role

---

### 6.5 Process for Adding New List of Values
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Admin + Backend

- Establish a workflow for adding new values to dropdowns/search filters (skills, subjects, etc.) so they are immediately available across the platform
- Admin UI to manage list-of-values without a code deploy

---

## 7. Profile Improvements

### 7.1 Improve Profile Pages
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend (Learner + Volunteer)

- General UX/design polish across volunteer and learner profile pages
- Better layout, clearer sections, improved mobile responsiveness

---

### 7.2 Volunteer Profile — Add Age Field
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend + Backend

- Add an "Age" field to the volunteer profile
- Validate on input (numeric, reasonable range)
- Display appropriately on public-facing profile

---

### 7.3 Skills to Be Added in the Profile Box
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend (Profile)

- Surface the user's skills/expertise directly in their profile card/box
- Visible at a glance without needing to scroll to a separate section

---

### 7.4 Rename and Segregate Skills Fields
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend + Backend (Profile)

- Rename **"Skills and expertise to learn"** → **"Skills and expertise to learn from Volunteers"**
- Rename **"Skills I have"** → **"Skills You Can Share with Learners"**
- Segregate volunteer and non-volunteer user views accordingly

---

### 7.5 Segregate Academic and Non-Academic Skills
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend + Backend (Profile + List of Values)

- Volunteer page: split "Skills and Expertise to Share" into Academic and Non-Academic categories
- Learner page: split "Specific Subject/Skill" into Academic and Non-Academic
- Update the list-of-values to reflect this categorisation

---

### 7.6 Highest Education Field
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend + Backend (Profile)

- Add a "Highest Education" field to volunteer and/or learner profiles
- Dropdown with standard education levels

---

### 7.7 Rename "Parent" to "Guardian Contact Number"
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend (Profile / Onboarding)

- Replace the label "Parent" with "Guardian Contact Number" across all forms and display screens

---

### 7.8 Hide Email IDs Across the Platform
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Frontend (All Apps)

- Mask or hide email addresses in all public-facing and shared views
- Affected areas: regular sessions list, instant sessions list, user profiles, admin views (where appropriate)
- Admins may retain visibility; regular users should not see other users' emails

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
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend (Landing Page)

- Embed or pull in Google Reviews on the landing page
- Show star rating, reviewer name, and excerpt
- Auto-update or periodically sync new reviews

---

### 8.3 Rotating Testimonials
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend (Landing Page)

- Add an auto-rotating testimonials section
- Manual controls (prev/next) with smooth transitions
- Source testimonials from admin portal (dynamic content)

---

## 9. Performance

### 9.1 System Performance Improvements (Super Hero Event)
**Priority:** 🔴 High | **Status:** 📋 Backlog  
**Area:** Backend + DevOps + Frontend

Goal: Improve user experience to a decent level with minimal cost ahead of the Super Hero Event.

**Quick wins to explore:**
- Enable HTTP response caching (Redis or in-memory) for frequent API calls
- Add database query indexes on high-traffic queries (sessions, user lookups)
- Enable CDN for static assets (images, JS bundles)
- Lazy load non-critical frontend components
- Review and optimise the slowest API endpoints (profiling)
- Reduce Docker container cold-start time (pre-warm instances or increase min instances on Cloud Run)
- Compress API responses (gzip/brotli)
- Front-end bundle size audit — remove unused dependencies

---

## 10. Forum / Community

### 10.1 Fix Video Upload in Forum
**Priority:** 🟡 Medium | **Status:** 📋 Backlog  
**Area:** Frontend + Backend (Forum)

- Users are currently unable to upload videos in the forum
- Investigate file size limits, storage configuration, and upload endpoint
- Add progress indicator and proper error messages for large uploads

---

## 11. UX / Misc

### 11.1 Better Design for Clock Icon
**Priority:** 🟢 Low | **Status:** 📋 Backlog  
**Area:** Frontend

- The current clock icon/display is not visually appealing
- Replace or redesign with a cleaner UI element that fits the brand

---

## Summary Table

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1.1 | Session Monitoring + Email Alerts | 🔴 High | 📋 Backlog |
| 1.2 | Auto-log Meeting Hours + Remove Claim Session | 🔴 High | 📋 Backlog |
| 1.3 | Instant Session Creation (Learner) | 🔴 High | 📋 Backlog |
| 1.4 | Instant Session on Landing Page | 🔴 High | 📋 Backlog |
| 1.5 | Separate Instant Session Page | 🟡 Medium | 📋 Backlog |
| 1.6 | Schedule Meeting CTA on Profile | 🟢 Low | 📋 Backlog |
| 2.1 | Skills Matching Automation + Emails | 🔴 High | 📋 Backlog |
| 2.2 | Chat Session Monitoring + Email Alerts | 🟡 Medium | 📋 Backlog |
| 2.3 | Approval Email Copy to Support | 🔴 High | 📋 Backlog |
| 2.4 | Notification Bell on All Pages | 🔴 High | 📋 Backlog |
| 3.1 | iOS + Windows App | 🔴 High | 📋 Backlog |
| 3.2 | WhatsApp + Google Messages Integration | 🟡 Medium | 📋 Backlog |
| 4.1 | Donation Screen + History Screen | 🟡 Medium | 📋 Backlog |
| 5.1 | CI/CD for Session Monitoring | 🟡 Medium | 📋 Backlog |
| 6.1 | Tutorial Links (Dynamic Admin Entry) | 🟡 Medium | 📋 Backlog |
| 6.2 | Learner Approval Process | 🔴 High | 📋 Backlog |
| 6.3 | Registration Date in Admin Page | 🟢 Low | 📋 Backlog |
| 6.4 | Role-Based Admin Review | 🟡 Medium | 📋 Backlog |
| 6.5 | New List of Values Process | 🟡 Medium | 📋 Backlog |
| 7.1 | Improve Profile Pages | 🟡 Medium | 📋 Backlog |
| 7.2 | Volunteer Age Field | 🟢 Low | 📋 Backlog |
| 7.3 | Skills in Profile Box | 🟡 Medium | 📋 Backlog |
| 7.4 | Rename + Segregate Skills Fields | 🟡 Medium | 📋 Backlog |
| 7.5 | Academic vs Non-Academic Skills | 🟡 Medium | 📋 Backlog |
| 7.6 | Highest Education Field | 🟢 Low | 📋 Backlog |
| 7.7 | Rename Parent → Guardian Contact | 🟢 Low | 📋 Backlog |
| 7.8 | Hide Email IDs Everywhere | 🔴 High | 📋 Backlog |
| 8.1 | Landing Page Carousel Redesign | 🟡 Medium | 📋 Backlog |
| 8.2 | Google Reviews on Landing Page | 🟡 Medium | 📋 Backlog |
| 8.3 | Rotating Testimonials | 🟢 Low | 📋 Backlog |
| 9.1 | Performance Improvements (Super Hero Event) | 🔴 High | 📋 Backlog |
| 10.1 | Fix Video Upload in Forum | 🟡 Medium | 📋 Backlog |
| 11.1 | Better Clock Icon Design | 🟢 Low | 📋 Backlog |
