# Product

## Register

product

## Users
Sales Agents and their Managers. Agents use low-spec computers (Gen 8, 8GB RAM, no dedicated GPU) and need a fast way to request help. Managers need to monitor and respond to these alerts instantly. Teams can log in using Thai or English team names.

## Product Purpose
A lightweight, real-time desktop SOS application. It allows telesales agents to request immediate assistance from their managers without disrupting their workflow, ensuring fast problem resolution.

## Current Features
- **Realtime SOS Sync**: Agents can press SOS, and it appears instantly on the Manager's dashboard via Firebase Realtime Database.
- **Manager Dashboard**: Tracks active alerts, total alerts, and resolved alerts in real-time. Managers can resolve alerts to clear the queue.
- **Team-based Scoping**: Users join a specific "Team" upon entry, and alerts are isolated to that team's Firebase node.

## Brand Personality
Reliable, Fast, Friendly.

## Anti-references
Do not use excessive JavaScript-based animations (like Canvas or Three.js) that would cause lag on low-spec PCs. Avoid complex nested cards, tiny unreadable text, or jarring native browser dialogs (`window.alert`).

## Design Principles
1. **Performance First (Overdrive)**: The UI renders fluidly on low-spec machines using Hardware-Accelerated CSS (transforms, opacity, border-radius morphing) for all "Liquid Emerald" effects.
2. **Expert Confidence**: The SOS action must feel solid and reliable, not flimsy.
3. **Clarity over Decoration**: Use visual cues (like color and size) for functional alerts.
4. **No Native Dialogs**: All notifications use custom, immersive Toast / Modal UI components.

## Accessibility & Inclusion
Ensure high contrast for readability via Auto Light/Dark mode. Keep motion minimal (respect prefers-reduced-motion) due to performance constraints and accessibility.
