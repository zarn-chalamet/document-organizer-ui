# Document Organizer UI

React frontend for [Document Organizer](https://github.com/zarn-chalamet/document-organizer) — a secure, PDPA-compliant document management app with AI-powered scanning, proactive document insights, and a friendly contextual AI assistant. Files are stored in the user's own Google Drive, never on our servers.

## Repositories

- **Frontend (this repo):** https://github.com/zarn-chalamet/document-organizer-ui
- **Backend:** https://github.com/zarn-chalamet/document-organizer
- **AI Sidecar:** https://github.com/zarn-chalamet/document-organizer-ai

## Problem It Solves

People — especially foreigners managing visas across countries — have important documents scattered across email, phone photos, and folders. This app provides one secure place to organize documents, track expiry dates, get proactive AI insights on renewal deadlines, and chat with an AI assistant that understands each individual document — all while keeping files in the user's own Google Drive.

## Tech Stack

- **Framework:** React 18 + Vite
- **UI Library:** Material-UI (MUI) v5 with custom dark theme
- **Routing:** React Router v6
- **HTTP Client:** Axios (with JWT interceptor)
- **Notifications:** Sonner (toast notifications)
- **Icons:** Material Icons
- **Fonts:** Inter + JetBrains Mono
- **Auth:** JWT stored in `localStorage` (issued by backend after Google OAuth)

## Design Philosophy

- **Modern, minimal, professional** — dark-first aesthetic with purple accent (`#8B5CF6`)
- **JetBrains Mono** for technical labels — feels like a developer tool
- **Subtle animations** — glow blobs, fade-ins, ripples — never distracting
- **Human-in-the-loop AI** — AI extracts, user verifies; no silent failures
- **Consistent spacing** — 8px grid system, generous padding
- **Clear visual hierarchy** — icon boxes with glows, mono-tracked labels, gradient headlines
- **Web-native mobile UX** — collapsible sections, not app-like bottom bars

## 🔒 PDPA Compliance & Security Architecture

This is not just a feature list — it's the reason the app was architected this way. Every design decision was made to keep users in control of their own data.

### Why This Architecture Exists

**Traditional document management apps** store your files on their servers. This creates:
- ❌ A honeypot for hackers
- ❌ Cross-user data leaks if bugs occur
- ❌ You lose access if the company shuts down
- ❌ Company can read/analyze your documents anytime
- ❌ Violates PDPA (Personal Data Protection Act) principles

**Our approach** flips this model:
- ✅ Files stay in **your own Google Drive** — we never store them
- ✅ We only store **metadata + text embeddings + AI insights** (not the files themselves)
- ✅ You can revoke access anytime via Google Account settings
- ✅ If our app shuts down, your files remain safely in your Drive
- ✅ Fully PDPA-compliant by design, not as an afterthought

### PDPA Principles We Follow

| PDPA Principle | How We Implement It |
|---------------|--------------------|
| **Data Minimization** | Only store metadata (title, expiry, category) + extracted text — never raw files |
| **Purpose Limitation** | Text is used ONLY for search/AI assistant. No analytics, no ads, no selling |
| **Storage Limitation** | Cascade delete removes ALL traces (Drive files + DB records + embeddings + insights) |
| **Data Portability** | Files are already in user's Drive — nothing to export |
| **User Control** | Every action is user-initiated. AI suggests, user confirms |
| **Transparency** | All AI operations are visible in UI ("AI extracted", "General knowledge", confidence badges) |

### Why Google Drive + Google Vision (Same Trust Boundary)

A common concern: *"Isn't sending images to Google Cloud Vision a privacy risk?"*

**No, because of the trust boundary principle:**

1. Users already trust Google — they log in with Google, store files in Google Drive
2. Google Vision is part of the same Google ecosystem
3. Vision API is **transient** — Google explicitly does not store the images ([Google's data policy](https://cloud.google.com/vision/docs/data-usage))
4. No new third party is introduced
5. This is safer than using AWS/Azure OCR (which would introduce a new vendor)

### Why Google Vision + Local Embeddings + Groq LLM

Each AI component was chosen deliberately for its privacy profile:

| Component | Runs Where | Why |
|-----------|-----------|-----|
| **OCR (Google Vision)** | Google Cloud (transient) | Same trust boundary as Google Drive |
| **Embeddings (sentence-transformers)** | **Locally on our server** | Vectors never leave infrastructure |
| **Metadata extraction (Groq)** | Groq API | Only extracted TEXT sent, never images |
| **Insights generation (Groq)** | Groq API | Only doc type + expiry + text preview |
| **Chat responses (Groq)** | Groq API | Only relevant text chunks + question |

**What Groq NEVER sees:**
- ❌ Your actual document files
- ❌ Your name, email, or any user identifiers
- ❌ Your entire document history
- ❌ Documents from other users

**What Groq sees:**
- ✅ Small text snippets (~500 chars) relevant to your specific question
- ✅ Just enough context to formulate an answer

### Security Features

- **JWT sessions** with 2-day expiry (HS256 signed)
- **Automatic token refresh** for Google API calls
- **User-scoped queries** — pgvector search filters by `user_id` (impossible to leak across users)
- **CORS restricted** to `localhost:5173` in development
- **Route protection** — unauthenticated users auto-redirect to login
- **JWT interceptor** — auto-attaches token to every API request
- **401 handling** — expired tokens trigger logout + redirect
- **Terms & Privacy modal** — reviewable content on login page
- **HTTPS-ready** — production deployment will use TLS everywhere

### What This Means for Users

**In plain language:**
- 🔐 You control your own data — it's in YOUR Drive
- 🚫 We can't read your documents behind your back
- 🗑️ Delete your account → everything is gone (Drive + database + embeddings + insights)
- 🌍 Even if our company disappears, your files are safe
- 🤝 We're a helpful layer on top of Google, not a data hoarder

## Features

### Core
- Google OAuth login (redirects to backend)
- Category-based organization with 12 preset types + custom
- Create / rename / delete categories with confirmation modals
- Upload documents (single or bulk) with drag-and-drop support
- Edit document title, description, expiry date
- Move documents between categories
- Search and filter documents by expiry status (all/expiring/expired/no date)
- Dashboard summary (totals, expiring soon, expired)
- Dark mode (default) + light mode toggle
- Toast notifications for all actions
- Skeleton loaders for smooth loading states
- **Terms of Service & Privacy Policy modal** on login (tabbed reader)

### 🤖 AI-Powered

#### Document Scanning
- **Google Vision OCR** — production-grade text extraction from images and PDFs
- **Multi-language support** — English + Thai (extensible)
- **LLM date extraction** — Groq Llama intelligently finds expiry dates in messy OCR text
- **Auto-fill expiry dates** — AI suggests, user confirms via verification banner

#### 🌟 AI Insights (NEW)
Every scanned document gets a beautifully rendered **Insights Panel** with:
- **Summary** — one-sentence description of what the document is
- **Next Action Card** — clear action with deadline + urgency (URGENT / SOON / UPCOMING / NO RUSH)
- **Key Rules** — 2-4 important rules specific to the document type
- **Warnings** — common mistakes and important caveats
- **Timeline** — upcoming dates rendered as a vertical timeline with connecting line
- **Confidence badge** — HIGH / MEDIUM / LOW so users know how trustworthy the insight is
- **Regenerate button** — refresh insights on demand when documents change

#### 💬 AI Assistant — Two Chat Modes

**1. Global Chat** — ask about ALL your documents
- Semantic search across all documents via pgvector RAG
- Suggested questions for quick access
- **Response categorization** — AI classifies every answer as:
  - 🟢 **DOC** — grounded in your specific documents (no badge)
  - 🟡 **NOT FOUND** — answer isn't in your documents (amber badge)
  - 🔵 **GENERAL** — general knowledge answer (blue badge + "verify with official sources" warning)

**2. Document-Scoped Chat** — discuss ONE specific document
- "Discuss with AI" button on every document detail page
- Chat panel shows a **purple "Discussing: {title}" pill** at the top
- Document-type-aware suggested questions (passport gets renewal questions, visa gets extension questions, etc.)
- AI has full context: extracted text, insights, expiry date
- One-click to clear context and return to global chat

#### Chat Panel UX
- **Resizable side panel** — drag left edge to resize (400-900px), double-click to reset
- **Width persistence** — panel size saved in localStorage
- **Modern typing indicator** — animated bouncing dots (like ChatGPT/Claude)
- **Online status indicator** with pulse animation
- **Custom purple scrollbar** matching the design system
- **Keyboard shortcuts** — Ctrl/Cmd+J to toggle, Esc to close
- **Unread badge** on FAB when new messages arrive while collapsed

### 📱 Mobile UX
- **Collapsible actions panel** — actions collapse into a "Actions" toggle button on mobile
- **Auto-close on selection** — actions collapse after user selects one
- **Tablet-friendly grids** — categories stack elegantly
- **Chat panel goes fullscreen** on small devices

### UX Polish
- Beautiful OAuth success page with animated status
- Redesigned login page with feature showcase
- Ambient glow orbs and gradient backgrounds
- Smooth fade-in animations
- Consistent purple accent throughout
- Modern logo + wordmark branding
- Empty states with clear CTAs
- **Grouped action cards** — hero (Ask AI) → file → manage → danger zone

## Setup

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8080`
- Python AI Sidecar running at `http://localhost:8000`

### Install & Run
```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Project Structure

```
src/
  ├── api/
  │   └── axios.jsx                    Axios instance with JWT interceptor
  ├── components/
  │   ├── Logo.jsx                     Brand logo component
  │   ├── Navbar.jsx
  │   ├── Sidebar.jsx
  │   ├── Layout.jsx                   App shell with responsive drawer
  │   ├── PageHeader.jsx               Breadcrumbs + title + actions
  │   ├── EmptyState.jsx               Reusable empty state
  │   ├── StatusBadge.jsx              Scan status indicator
  │   ├── ActivityFeed.jsx             Dashboard activity sidebar
  │   ├── ActionButton.jsx             Reusable action row (icon + label + hint + variants)
  │   ├── ChatWidget.jsx               Global resizable chat panel with document context
  │   ├── ChatMessage.jsx              Chat bubble with category badge parser
  │   ├── chatBus.js                   Global helper for opening chat with document context
  │   ├── InsightsPanel.jsx            AI insights display (summary, next action, timeline)
  │   ├── AiVerificationBanner.jsx     Confirm AI-extracted expiry dates
  │   ├── TermsPrivacyModal.jsx        Tabbed Terms of Service + Privacy Policy reader
  │   ├── CreateCategoryModal.jsx
  │   ├── EditCategoryModal.jsx
  │   ├── DeleteCategoryModal.jsx
  │   ├── EditDocumentModal.jsx
  │   ├── MoveDocumentModal.jsx
  │   └── DeleteDocumentModal.jsx
  └── pages/
      ├── Landing.jsx                  Public marketing landing page
      ├── Login.jsx                    Modern login with Terms/Privacy modal
      ├── OAuthSuccess.jsx             Animated auth success + redirect
      ├── Dashboard.jsx                Category grid + stats + activity
      ├── CategoryDetail.jsx           Documents grid + search/filter
      ├── UploadDocument.jsx           Single + bulk upload with drag-and-drop
      └── DocumentDetail.jsx           Details + insights panel + grouped actions
```

## Authentication Flow

```
1. User clicks "Continue with Google" on login page
2. Frontend redirects to backend: /oauth2/authorization/google
3. Backend redirects to Google's consent screen
4. User authorizes app access to their Google Drive
5. Google redirects back to backend callback URL
6. Backend generates JWT and redirects to: /oauth-success#token=xxx&email=xxx
7. Frontend extracts JWT from URL hash (never in query string — hash isn't sent to server)
8. JWT stored in localStorage
9. All future API calls include JWT via Axios interceptor
10. On 401 responses, user is auto-logged out and redirected to login
```

**Why hash-based token delivery?**
URL hash fragments (`#token=xxx`) are **never sent to servers** by browsers — only accessible via JavaScript. This prevents accidental token leakage to server logs.

## AI Assistant Chat Flow

### Global Chat (all documents)

```
1. User clicks FAB or presses Ctrl+J
2. Chat panel slides in from right
3. User types or selects a suggested question
4. Frontend POSTs to /v1/api/chat with the question + JWT
5. Backend:
     - Vectorizes question via Python sidecar
     - Searches pgvector for top 5 relevant chunks (filtered by user_id)
     - Sends chunks + question to Python sidecar
     - Python sidecar calls Groq LLM with 3-category classification
6. AI response returned with [DOC], [NOTFOUND], or [GENERAL] tag
7. Frontend parses tag → shows appropriate badge + warning
```

### Document-Scoped Chat

```
1. User clicks "Discuss with AI" on a document detail page
2. openChatWithDocument(doc) called via chatBus.js
3. Chat panel opens with purple "Discussing: {title}" pill
4. User asks a question (e.g., "when should I renew this?")
5. Frontend POSTs to /v1/api/documents/{id}/chat
6. Backend calls Python /chat/document with full document context
7. AI answers using extracted text + insights specific to this doc
8. User can click X on pill to return to global chat mode
```

**Example interactions (global chat):**

| User asks | AI responds | Badge |
|-----------|-------------|-------|
| "When does my passport expire?" | "Your passport expires on **April 12, 2027** 📅 You have plenty of time!" | (none — DOC) |
| "What's my driver's license number?" | "I don't see a driver's license in your uploaded documents 🔍" | 🟡 NOT FOUND |
| "Do I need 6 months validity for a visa?" | "Yes, most countries require... **6-month rule**." + verify warning | 🔵 GENERAL |

## Routes

| Path | Description | Auth Required |
|------|-------------|--------------|
| `/` | Public landing page | ❌ |
| `/login` | Google login page with Terms/Privacy modal | ❌ |
| `/oauth-success` | OAuth callback handler | ❌ |
| `/app` | Dashboard (categories + summary) | ✅ |
| `/categories/:id` | Documents inside a category | ✅ |
| `/categories/:id/upload` | Upload single/bulk documents | ✅ |
| `/documents/:id` | Document details + AI insights + actions | ✅ |

## Design System

### Color Palette
```
Primary Purple:    #8B5CF6 → #7C3AED (gradient)
Accent Pink:       #EC4899 (for AI chat gradient)
Blue Accent:       #3B82F6 (general knowledge badges)
Success Green:     #10B981
Warning Amber:     #F59E0B (soon-expiring, warnings)
Error Red:         #EF4444 (danger zone, expired)
Background Dark:   #0A0A0B
Card Background:   #111113
```

### Typography
```
Body:      Inter (400, 500, 600, 700)
Mono:      JetBrains Mono (for labels, dates, codes, tags)
Headings:  Inter, -0.02em letter-spacing
Labels:    JetBrains Mono, uppercase, 0.08em tracking
```

### Reusable Patterns
- **Glow blobs** — ambient radial gradients in backgrounds
- **Icon boxes** — rounded squares with 20% opacity color fills
- **Status pills** — mono-uppercase labels with matching accent dots
- **Metadata rows** — icon + uppercase label + mono value
- **Ghost cards** — dashed border, hover-to-fill CTAs
- **Grouped action cards** — hero → file → manage → danger zone
- **Timeline pattern** — vertical gradient line with pulsing dots

## Roadmap

Frontend features track the [backend roadmap](https://github.com/zarn-chalamet/document-organizer#roadmap).

### ✅ Completed
- [x] Google OAuth login with animated success page
- [x] Modern dark-first design system
- [x] Dashboard with category grid + stats + activity feed
- [x] Category CRUD with confirmation modals
- [x] Document upload (single + bulk) with drag-and-drop
- [x] Document CRUD with move-between-categories
- [x] Search + filter with debouncing
- [x] Toast notifications (Sonner)
- [x] Skeleton loaders throughout
- [x] Scan status badges
- [x] AI Assistant chat with suggested questions
- [x] Dark + light mode toggle
- [x] Redesigned login with feature showcase
- [x] Custom logo + branding
- [x] AI verification banner (confirm/edit extracted dates)
- [x] **Terms & Privacy Policy modal on login**
- [x] **Public landing page with feature showcase**
- [x] **AI Insights panel per document (summary + next action + timeline)**
- [x] **Document-scoped AI chat with context pill**
- [x] **Response categorization badges (DOC / NOTFOUND / GENERAL)**
- [x] **Resizable chat panel with localStorage persistence**
- [x] **Grouped action cards (hero / file / manage / danger)**
- [x] **Mobile-collapsible actions panel**
- [x] **Reusable ActionButton component**

### 🚧 In Progress
- [ ] PDPA consent modal on first login
- [ ] Dedicated privacy policy page
- [ ] Deploy to Vercel

### 🔮 Future
- [ ] Chat history persistence
- [ ] Source attribution in chat responses ("From: passport.pdf, page 2")
- [ ] In-app PDF/image preview
- [ ] Streaming chat responses
- [ ] Settings page (theme, notifications, AI toggle)
- [ ] Data export (metadata JSON + insights)
- [ ] Multi-language UI (Thai, Chinese)
- [ ] Calendar export (.ics) for insights timeline
- [ ] Related documents suggestions

## Contributing

This is a portfolio project, but suggestions and issues are welcome!

## License

MIT
