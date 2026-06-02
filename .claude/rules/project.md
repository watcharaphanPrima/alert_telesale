# Telesales Helpdesk - Project Rules

## Tech Stack
- Frontend: React + TypeScript + Vanilla CSS
- Backend: Firebase Realtime Database
- Desktop Core: Tauri (Rust)

## Styling Rules
- DO NOT use TailwindCSS. Use pure Vanilla CSS or CSS Modules.
- Emphasize glassmorphism, modern aesthetics, and micro-animations.

## Code Quality
- Ensure all React components use functional components and hooks.
- Handle Firebase listeners with proper `useEffect` cleanup to prevent memory leaks.
- Always use `useContext` or props for state, avoid complex external state managers for now to keep it lightweight.
