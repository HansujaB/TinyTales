# 📚 TinyTales — AI Storytelling Platform for Preschool Teachers

TinyTales is an AI-powered storytelling companion designed for **preschool teachers (ages 3–6)**. It helps educators generate, customize, and deliver interactive stories, moral lessons, quizzes, and emotion-based comfort stories — all in real-time, with a warm, playful **Neubrutalism UI**.

---

## 🎨 Features

| Feature | Description |
|---------|-------------|
| **✨ AI Story Generation** | Generate age-appropriate stories using Google Gemini with topic, characters, theme, length, and language controls |
| **💡 Moral Extraction** | Auto-extract moral lessons from any story via Groq |
| **🎯 Quiz Generation** | Auto-generate comprehension quizzes with explanations |
| **🔊 Text-to-Speech** | Built-in read-aloud using Web Speech API |
| **💛 Emotion Corner** | Select a child's emotion → get a comforting story |
| **➕ Story Continuation** | Continue stories based on children's suggestions |
| **📚 Library** | Save, search, favorite, and paginate stories |
| **⚙️ Settings** | Manage profile, school, default preferences |
| **🔐 Google Auth** | Firebase Authentication with Google OAuth |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast dev server and builds
- **Neubrutalism CSS** — custom design system (bold borders, flat colors, hard drop shadows)
- **React Router v6** — client-side routing
- **Zustand** — global state (auth, story, UI)
- **Firebase Auth** — Google OAuth
- **Axios** — API calls
- **Lucide React** — icons
- **Framer Motion** — animations

### Backend
- **FastAPI** (Python 3.11+) — async API framework
- **Google Gemini API** (`gemini-1.5-flash`) — story generation, lesson plans
- **Groq API** (`llama-3.3-70b-versatile`) — moral extraction, quiz generation, emotion stories
- **MongoDB Atlas** (Motor async driver) — database
- **Firebase Admin SDK** — token verification
- **Redis** (optional) — caching & rate limiting

---

## 📁 Project Structure

```
TinyTales/
├── README.md
├── claude.md                        ← Full project specification
│
├── backend/
│   ├── .env                         ← Backend env vars (fill in)
│   ├── .env.example
│   ├── requirements.txt
│   └── app/
│       ├── main.py                  ← FastAPI entry point
│       ├── core/config.py           ← Pydantic settings
│       ├── agents/                  ← AI agents (story, moral, quiz, emotion, etc.)
│       ├── routers/                 ← API routes (auth, story, quiz, library, emotion)
│       ├── models/                  ← Pydantic request models
│       ├── db/mongo.py              ← Motor async MongoDB client
│       ├── middleware/              ← Firebase auth middleware
│       └── utils/                   ← Prompt templates, PDF, TTS
│
└── frontend/
    ├── .env                         ← Frontend env vars (fill in)
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                 ← React entry point
        ├── App.jsx                  ← Router, layout, auth guard
        ├── index.css                ← Neubrutalism design system
        ├── api/                     ← Axios API layer (story, quiz, library, emotion, auth)
        ├── components/
        │   ├── auth/ProtectedRoute.jsx
        │   └── layout/              ← Navbar, Sidebar
        ├── hooks/                   ← useAuth, useTTS
        ├── lib/                     ← firebase.js, constants.js
        ├── pages/                   ← Landing, Login, Dashboard, StoryGenerator,
        │                               Library, EmotionCorner, Settings
        └── store/                   ← Zustand stores (auth, story, UI)
```

---

## 🚀 Environment Variables Setup Guide

You need to set up **5 services** and fill in env vars in two files:

| File | Location |
|------|----------|
| `backend/.env` | Backend API keys & database connections |
| `frontend/.env` | Firebase client config & API URL |

---

### 1️⃣ MongoDB Atlas (Database)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up / log in
2. **Create a new Project** → name it `TinyTales`
3. **Build a Database** → choose the **FREE Shared** tier (M0)
   - Provider: AWS (any region close to you, e.g. Mumbai `ap-south-1` for India)
   - Cluster name: `Cluster0` (default is fine)
4. **Create a Database User**:
   - Click **Database Access** (left sidebar)
   - **Add New Database User**
   - Auth method: Password
   - Username: `tinytales_user`
   - Password: **generate a strong password** → save it somewhere safe
   - Role: `Atlas admin` (or `readWriteAnyDatabase`)
5. **Network Access** (left sidebar):
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** → adds `0.0.0.0/0`
   - (For production, restrict to your server IP)
6. **Get Connection String**:
   - Go to **Database** → click **Connect** on your cluster
   - Choose **Drivers** → **Python** → copy the connection string
   - It looks like: `mongodb+srv://tinytales_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>`** with your actual password

**Set in `backend/.env`:**
```env
MONGODB_URL=mongodb+srv://tinytales_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=tinytales
```

> Collections (`users`, `stories`, `quizzes`, `classrooms`, `lesson_plans`) are auto-created on first write.

---

### 2️⃣ Firebase (Authentication)

#### A) Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `TinyTales` → disable Google Analytics (optional) → **Create**
3. Wait for project creation

#### B) Enable Google Sign-In

1. In Firebase Console → **Authentication** (left sidebar) → **Get Started**
2. Click **Sign-in method** tab
3. Click **Google** → **Enable** it
4. Set your **Project support email** (your Gmail) → **Save**

#### C) Get Frontend Config (Web App)

1. Go to **Project Settings** (gear icon ⚙️ at top left)
2. Scroll to **Your apps** → click the **Web icon** `</>`
3. Register app → name it `TinyTales Web` → **Register**
4. You'll see a config object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyB...",
     authDomain: "tinytales-xxxxx.firebaseapp.com",
     projectId: "tinytales-xxxxx",
     storageBucket: "tinytales-xxxxx.appspot.com",
   };
   ```
5. Copy these values

**Set in `frontend/.env`:**
```env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=tinytales-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tinytales-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=tinytales-xxxxx.appspot.com
```

#### D) Get Service Account Key (Backend)

1. In Firebase Console → **Project Settings** → **Service accounts** tab
2. Click **Generate new private key** → **Generate key**
3. A JSON file will download (e.g. `tinytales-xxxxx-firebase-adminsdk-xxxxx.json`)
4. **Rename** it to `firebase-service-account.json`
5. **Move** it into `backend/` folder (same level as `requirements.txt`)

**Set in `backend/.env`:**
```env
FIREBASE_PROJECT_ID=tinytales-xxxxx
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

---

### 3️⃣ Google Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key** → select your Google Cloud project (or create one)
4. Copy the API key

**Set in `backend/.env`:**
```env
GEMINI_API_KEY=AIzaSy...your_gemini_key
```

---

### 4️⃣ Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com) and sign up / log in
2. Go to **API Keys** (left sidebar)
3. Click **Create API Key** → name it `TinyTales` → **Create**
4. Copy the key (starts with `gsk_`)

**Set in `backend/.env`:**
```env
GROQ_API_KEY=gsk_...your_groq_key
```

---

### 5️⃣ Redis (Optional)

Redis is used for rate limiting. You can skip it for development.

- Leave `REDIS_URL=` empty in `backend/.env` to skip Redis
- For production, use [https://redis.io/cloud](https://redis.io/cloud) (free tier available)

---

## 📋 Complete Env Files

### `backend/.env`
```env
# AI APIs
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here

# Firebase
FIREBASE_PROJECT_ID=tinytales-xxxxx
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# MongoDB
MONGODB_URL=mongodb+srv://tinytales_user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=tinytales

# Redis (leave empty to skip)
REDIS_URL=

# App
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tinytales-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tinytales-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=tinytales-xxxxx.appspot.com
```

---

## 🏃 Running Locally

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** installed
- All env vars filled in (see above)
- `firebase-service-account.json` placed in `backend/`

### Backend
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs on **http://localhost:8000**  
API docs at **http://localhost:8000/docs**

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/verify` | Verify Firebase token, upsert user |
| `GET` | `/api/auth/me` | Get current user profile |
| `PATCH` | `/api/auth/preferences` | Update user preferences |

### Story
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/story/generate` | Generate a new story |
| `POST` | `/api/story/generate/stream` | Stream story generation (SSE) |
| `POST` | `/api/story/moral` | Extract moral from story |
| `POST` | `/api/story/continue` | Continue a story |
| `POST` | `/api/story/save` | Save story to library |
| `GET` | `/api/story/{id}` | Get story by ID |
| `DELETE` | `/api/story/{id}` | Delete story |
| `PATCH` | `/api/story/{id}/favorite` | Toggle favorite |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/generate` | Generate quiz from story |

### Library
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/library` | Get all stories (paginated) |
| `GET` | `/api/library/favorites` | Get favorite stories |
| `GET` | `/api/library/search` | Search stories |

### Emotion
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/emotion/story` | Generate emotion comfort story |

---

## 🎨 Design System — Neubrutalism

The UI follows a **Neubrutalism** design philosophy:
- **Bold black borders** (4px solid `#1A1A2E`)
- **Flat colors** — tangerine orange, sunshine yellow, leaf green, story purple, sky blue
- **Hard drop shadows** (`5px 5px 0px #1A1A2E`)
- **Chunky typography** — Fredoka One for headings, Nunito for body
- **Tactile interactions** — buttons press down on hover/click
- **Playful animations** — floating, wiggling, bouncing elements

---

## 📄 License

Built with ❤️ for preschool teachers everywhere.

---

*TinyTales — Where Little Imaginations Come to Life ✨*
