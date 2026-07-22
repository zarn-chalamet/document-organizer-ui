# Document Organizer UI

React frontend for [Document Organizer](https://github.com/zarn-chalamet/document-organizer) — a secure document management app with AI-powered scanning and chat, storing files in the user's own Google Drive.

## Repositories

- **Frontend (this repo):** https://github.com/zarn-chalamet/document-organizer-ui
- **Backend:** https://github.com/zarn-chalamet/document-organizer
- **AI Sidecar:** https://github.com/zarn-chalamet/document-organizer-ai

## Tech Stack

- **Framework:** React 18 + Vite
- **UI Library:** Material-UI (MUI) v5
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Auth:** JWT stored in `localStorage` (issued by backend after Google OAuth)

## Features

- Google OAuth login (redirects to backend)
- Category-based organization with 12 preset types + custom
- Create / rename / delete categories with confirmation modals
- Upload documents (single or bulk) with auto AI scanning
- Edit document title, description, expiry date
- Move documents between categories
- Search and filter documents by expiry status
- Dashboard summary (totals, expiring soon, expired)
- **AI Assistant chat** — ask natural language questions about your documents
- Protected routes with automatic redirect to login

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
  │   ├── Navbar.jsx
  │   ├── Sidebar.jsx            (includes AI Assistant link)
  │   ├── ChatMessage.jsx        (chat bubble component)
  │   ├── CreateCategoryModal.jsx
  │   ├── EditCategoryModal.jsx
  │   ├── DeleteCategoryModal.jsx
  │   ├── EditDocumentModal.jsx
  │   └── MoveDocumentModal.jsx
  └── pages/
      ├── Login.jsx
      ├── OAuthSuccess.jsx       Handles JWT from URL hash
      ├── Dashboard.jsx          Category list + summary stats
      ├── CategoryDetail.jsx     Documents in category
      ├── UploadDocument.jsx     Single + bulk upload
      ├── DocumentDetail.jsx     Document actions
      └── Chat.jsx               AI Assistant chat interface
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
2. Frontend redirects to backend: /oauth2/authorization/google
3. Backend redirects to Google
4. User authorizes
5. Google redirects to backend callback
6. Backend redirects to: /oauth-success#token=xxx&email=xxx
7. Frontend extracts JWT from URL, saves to localStorage
8. All future API calls include JWT via axios interceptor
```

## AI Chat Flow

```
1. User opens Sidebar → AI Assistant
2. Types a question about their documents
3. Frontend POSTs to /v1/api/chat with the question
4. Backend embeds the question, searches pgvector for relevant chunks
5. Backend sends chunks + question to Python sidecar → Groq LLM
6. Answer displayed in chat bubble UI
```

## Routes

| Path | Description |
|------|-------------|
| `/login` | Google login page |
| `/oauth-success` | OAuth callback handler |
| `/` | Dashboard (categories + summary) |
| `/categories/:id` | Documents inside a category |
| `/categories/:id/upload` | Upload single/bulk documents |
| `/documents/:id` | Document details + actions |
| `/chat` | AI Assistant chat interface |

## Roadmap

Frontend features track the backend roadmap. See [backend README](https://github.com/zarn-chalamet/document-organizer#roadmap).

### UI Polish (In Progress)
- [ ] Toast notifications (replace alerts)
- [ ] Skeleton loaders (replace "Loading...")
- [ ] Scan status badge on document cards
- [ ] Source attribution in chat responses
- [ ] Chat history persistence
- [ ] Dark mode
- [ ] Mobile responsive polish
- [ ] In-app PDF/image preview
- [ ] PDPA consent modal on first login

## License

MIT
