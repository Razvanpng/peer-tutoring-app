# PeerTutor

A minimalist, high-performance workspace designed for students who need to cut through the noise. No social feeds, no distractions—just a direct link between learners and mentors in a focused, technical environment.

## The Concept
I built PeerTutor because academic collaboration shouldn't feel like a social media platform. The UI follows an Editorial Brutalist aesthetic: deep blacks, subtle grids, and monochrome technical accents. It is designed to look and feel like a professional tool, prioritizing function and clarity over visual fluff.

## Demo & Visuals

- **Live Production:** [https://peer-tutoring-app.vercel.app/]

### Workspace
Real-time synchronized environment featuring live chat, file attachments, and a collaborative editor that stays in sync without page refreshes.

[Screenshot 1]

### Directory
Scan the network for verified peers. Filter by subject, check reputation, and initialize a connection instantly.

[Screenshot 2]

- **Video Walkthrough:** [YouTube]

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS for the custom architectural layout.
- **State & Data:** TanStack Query for smart caching and server-state synchronization.
- **BaaS (Backend):** Supabase (PostgreSQL, Row Level Security, and WebSockets for real-time comms).
- **Shared Editor:** Integrated Monaco Editor for a professional-grade writing and coding experience.

## Database Architecture

- `profiles`: Handles user designations (mentor/mentee), bios, and expertise vectors.
- `sessions`: Manages the lifecycle of a connection (pending, accepted, completed) and stores telemetry/ratings.
- `messages`: Stores the chat history linked to session IDs.

## Local Environment Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Razvanpng/peer-tutoring-app
   cd peer-tutoring-app

2. **Install dependencies:**
    ```bash
    npm install

3. **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key

4. **Start:**
    ```bash
    npm run dev