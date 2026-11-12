# CampusMind — MERN University Knowledge Assistant

CampusMind is a React, Express, MongoDB, and Node.js foundation for an AI-powered university knowledge assistant.

## Included now

- Responsive CampusMind interface with dark and light themes.
- University-focused chat prompt with suggestion chips and response modes.
- React frontend connected to an Express API.
- Optional OpenAI Responses API integration, with reliable local demo replies when no key is configured.
- Mongoose conversation model that saves chat history when `MONGODB_URI` is configured.
- Input validation, API health endpoint, and centralized Express error handling.

## Clean project structure

- `client/` — React/Vite user interface only
- `server/config/` — database connection setup
- `server/controllers/` — request handling logic
- `server/middleware/` — reusable Express middleware
- `server/models/` — Mongoose data models
- `server/routes/` — API endpoint definitions
- `server/services/` — AI and future retrieval integrations
- `.env.example` — local MongoDB and optional AI configuration

The older standalone HTML/CSS/JS prototype is intentionally not part of this structure. This folder is the MERN version only.

## Run locally

1. Copy `.env.example` to `.env` and set `MONGODB_URI` if you want to save chats.
2. Set `OPENAI_API_KEY` if you want live LLM replies. Without it, CampusMind uses built-in demo responses.
3. Run `npm install` and then `npm run dev`.

The React app runs at `http://127.0.0.1:5173` and the API runs at `http://127.0.0.1:5001`.

## Ready for later additions

- Add authentication through a new `server/routes/authRoutes.js`, controller, middleware, and `User` model.
- Add the RAG pipeline under `server/services/`, then expose it through its own route/controller.
- Extend the MongoDB models once you are ready to persist users, documents, embeddings, and chat history.
