# Document Organizer UI

React frontend for [Document Organizer](https://github.com/zarn-chalamet/document-organizer) — a secure, PDPA-compliant document management app with AI-powered scanning and a friendly AI assistant. Files are stored in the user's own Google Drive, never on our servers.

## Repositories

- **Frontend (this repo):** https://github.com/zarn-chalamet/document-organizer-ui
- **Backend:** https://github.com/zarn-chalamet/document-organizer
- **AI Sidecar:** https://github.com/zarn-chalamet/document-organizer-ai

## Problem It Solves

People — especially foreigners managing visas across countries — have important documents scattered across email, phone photos, and folders. This app provides one secure place to organize documents, track expiry dates, and ask an AI assistant questions about them — all while keeping files in the user's own Google Drive.

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
- ✅ We only store **metadata + text embeddings** (not the files themselves)
- ✅ You can revoke access anytime via Google Account settings
- ✅ If our app shuts down, your files remain safely in your Drive
- ✅ Fully PDPA-compliant by design, not as an afterthought

### PDPA Principles We Follow

| PDPA Principle | How We Implement It |
|---------------|--------------------|
| **Data Minimization** | Only store metadata (title, expiry, category) + extracted text — never raw files |
| **Purpose Limitation** | Text is used ONLY for search/AI assistant. No analytics, no ads, no selling |
| **Storage Limitation** | Cascade delete removes ALL traces (Drive files + DB records + embeddings) |
| **Data Portability** | Files are already in user's Drive — nothing to export |
| **User Control** | Every action is user-initiated. AI suggests, user confirms |
| **Transparency** | All AI operations are visible in UI ("AI extracted", "Verify") |

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
- **HTTPS-ready** — production deployment will use TLS everywhere

### What This Means for Users

**In plain language:**
- 🔐 You control your own data — it's in YOUR Drive
- 🚫 We can't read your documents behind your back
- 🗑️ Delete your account → everything is gone (Drive + database + embeddings)
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

### AI-Powered
- **Google Vision OCR** — production-grade text extraction from images and PDFs
- **Multi-language support** — English + Thai (extensible)
- **LLM date extraction** — Groq Llama intelligently finds expiry dates in messy OCR text
- **Auto-fill expiry dates** — AI suggests, user confirms
- **AI Assistant chatbot** — natural language questions about your documents
  - Suggested questions for quick access
  - Friendly, conversational responses (not robotic)
  - Powered by semantic search (RAG architecture)
  - User-scoped — only your documents

### UX Polish
- Beautiful OAuth success page with animated status
- Redesigned login page with feature showcase
- Ambient glow orbs and gradient backgrounds
- Smooth fade-in animations
- Consistent purple accent throughout
- Modern logo + wordmark branding
- Empty states with clear CTAs

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
  │   └── axios.jsx              Axios instance with JWT interceptor
  ├── components/
  │   ├── Logo.jsx               Brand logo component
  │   ├── Navbar.jsx
  │   ├── Sidebar.jsx            (includes AI Assistant link)
  │   ├── PageHeader.jsx         Breadcrumbs + title + actions
  │   ├── EmptyState.jsx         Reusable empty state
  │   ├── StatusBadge.jsx        Scan status indicator
  │   ├── ActivityFeed.jsx       Dashboard activity sidebar
  │   ├── ChatMessage.jsx        Chat bubble component
  │   ├── CreateCategoryModal.jsx
  │   ├── EditCategoryModal.jsx
  │   ├── DeleteCategoryModal.jsx
  │   ├── EditDocumentModal.jsx
  │   ├── MoveDocumentModal.jsx
  │   └── DeleteDocumentModal.jsx
  └── pages/
      ├── Login.jsx              Modern login with feature showcase
      ├── OAuthSuccess.jsx       Animated auth success + redirect
      ├── Dashboard.jsx          Category grid + stats + activity
      ├── CategoryDetail.jsx     Documents grid + search/filter
      ├── UploadDocument.jsx     Single + bulk upload with drag-and-drop
      ├── DocumentDetail.jsx     Details + actions + AI extracted info
      └── Chat.jsx               AI Assistant chat interface
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

```
1. User opens Sidebar → clicks AI Assistant
2. Sees chat panel with suggested questions
3. Types or selects a question
4. Frontend POSTs to /v1/api/chat with the question + JWT
5. Backend:
     - Vectorizes question via Python sidecar
     - Searches pgvector for top 5 relevant chunks (filtered by user_id)
     - Sends chunks + question to Python sidecar
     - Python sidecar calls Groq LLM
6. Friendly, formatted answer displayed in chat bubble
```

**Example interactions:**

| User asks | AI responds |
|-----------|-------------|
| "When does my passport expire?" | "Your passport expires on **April 12, 2027** — you have plenty of time! 📅 If you're planning international travel, make sure it's valid for at least 6 months beyond your trip date." |
| "What visas do I have?" | "You have one visa on file: **Thailand Student Visa**, extended until August 4, 2026 ✈️" |
| "Anything expiring soon?" | "Good news — nothing is expiring in the next 30 days! ✅ Your documents are in good standing." |

## Routes

| Path | Description | Auth Required |
|------|-------------|--------------|
| `/login` | Google login page | ❌ |
| `/oauth-success` | OAuth callback handler | ❌ |
| `/` | Dashboard (categories + summary) | ✅ |
| `/categories/:id` | Documents inside a category | ✅ |
| `/categories/:id/upload` | Upload single/bulk documents | ✅ |
| `/documents/:id` | Document details + actions | ✅ |
| `/chat` | AI Assistant chat interface | ✅ |

## Design System

### Color Palette
```
Primary Purple:    #8B5CF6 → #7C3AED (gradient)
Blue Accent:       #3B82F6
Success Green:     #10B981
Warning Amber:     #F59E0B
Error Red:         #EF4444
Background Dark:   #0A0A0B
```

### Typography
```
Body:      Inter (400, 500, 600, 700)
Mono:      JetBrains Mono (for labels, dates, codes)
Headings:  Inter, -0.02em letter-spacing
Labels:    JetBrains Mono, uppercase, 0.08em tracking
```

### Reusable Patterns
- **Glow blobs** — ambient radial gradients in backgrounds
- **Icon boxes** — 40x40 rounded squares with 20% opacity color fills
- **Status pills** — mono-uppercase labels with matching accent dots
- **Metadata rows** — icon + uppercase label + mono value
- **Ghost cards** — dashed border, hover-to-fill CTAs

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
- [x] AI Assistant chat interface with suggested questions
- [x] Dark + light mode toggle
- [x] Redesigned login with feature showcase
- [x] Custom logo + branding

### 🚧 In Progress
- [ ] AI verification banner (confirm/edit extracted dates)
- [ ] "AI extracted" badge on auto-filled fields
- [ ] PDPA consent modal on first login
- [ ] Privacy policy page

### 🔮 Future
- [ ] Chat history persistence
- [ ] Source attribution in chat responses ("From: passport.pdf, page 2")
- [ ] In-app PDF/image preview
- [ ] Mobile responsive polish
- [ ] Settings page (theme, notifications, AI toggle)
- [ ] Data export (metadata JSON)
- [ ] Landing page for public marketing
- [ ] Multi-language UI (Thai, Chinese)

## Contributing

This is a portfolio project, but suggestions and issues are welcome!

## License

MIT
