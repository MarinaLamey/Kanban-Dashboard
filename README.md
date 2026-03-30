🚀 Enterprise Kanban Dashboard high-performance, real-time Task Management System built with Next.js 16, TypeScript, and dnd-kit. This project was developed as a technical assessment to demonstrate expertise in frontend architecture, state synchronization, and fluid user experiences.
✨ Key Features & Technical HighlightsAdvanced Drag & Drop:
 Engineered using @dnd-kit for seamless task reordering and cross-column movement.
 Optimistic UI Updates: Leveraging TanStack Query (v5) to provide zero-latency feedback during task creation, deletion, and movement—syncing with the server in the background.
 🧠 Optimistic UI & Cache Synchronization LogicTo ensure a "Zero-Latency" experience, the application implements Optimistic Updates using TanStack Query v5.
  This is particularly critical for a Kanban board where users expect instant visual feedback when dragging tasks.How it works (The Sync Cycle):onMutate: As soon as a task is moved or deleted, we manually update the local cache to reflect the change immediately.
  We also "snapshot" the previous state to act as a safety net.onError: If the JSON-Server fails to process the request (e.g., network error), the system automatically triggers a Rollback using the snapshotted data to restore UI integrity.onSettled: Finally, we invalidate the ['tasks'] query to perform a background re-fetch, ensuring the client is 100% in sync with the server's truth.
 60FPS Fluidity: Integrated Framer Motion with AnimatePresence and layout prop for buttery-smooth transitions and staggered entry animations.
 State-of-the-art Stack: Built on Next.js 16 (App Router) and React 19, styled with Material UI (v7) and customized with a premium dark-themed aesthetic.
 Scalable Architecture:Custom Hooks: Logic encapsulation via useTasks hook for clean separation of concerns.
 Isolated Pagination: Independent pagination state for each column to handle large datasets efficiently.Real-time Search: Instant filtering of tasks by title or description using optimized useMemo logic.
 /**
 * ENVIRONMENT-AWARE API CONFIGURATION
 * * Logic:
 * 1. During Local Development (localhost): 
 * The app communicates with the requested 'json-server' running on port 3001.
 * * 2. During Production (Vercel/Live): 
 * Since json-server cannot persist data in serverless environments, 
 * the app automatically switches to the built-in Next.js API Route Handlers (/api/tasks).
 */
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/tasks' 
  : '/api/tasks';
 🛠 Tech Stack:
 Framework: Next.js 16 (App Router) / TypeScript.
 State/Data: TanStack Query v5 / Axios.
 Styling: MUI v7 / Emotion / Framer Motion.
 DnD Engine: @dnd-kit (Core, Sortable, Utilities).
 Backend: JSON-Server (Mock API).
 🚀 Getting Started
1. Clone the repository
git clone <your-repo-link>
cd kanban-dashboard
2. Install Dependencies
npm install
3. Run the Development Environment
This project uses concurrently to launch both the Next.js frontend and the JSON-Server backend with a single command:
npm run dev
Frontend: http://localhost:3000
Mock API: http://localhost:3001/tasks

📁 Project Structure
/app: Next.js 16 pages and layouts.
/componant: Modular UI components (Kanban, Columns, Cards).
/hooks: Logic for data fetching and mutations (Optimistic UI).
/types: Centralized TypeScript definitions.
