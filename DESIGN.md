---
vibe: Playful & Friendly
primaryColor: Emerald
componentShape: Pill-shaped
density: Airy & Spacious
colorMode: Auto (Dark & Light)
---

# Design System (Seeded)

This document serves as the single source of truth for the project's visual language and component architecture, generated via `/impeccable document --seed`.

## Core Principles

1. **Playful & Friendly:** The application should feel inviting, accessible, and positive. Interactions should be bouncy and forgiving.
2. **Airy & Spacious:** Layouts must breathe. Generous padding (`--space-lg`, `--space-xl`) should separate distinct sections, preventing cognitive overload.
3. **Emerald Core:** The primary brand color represents safety, growth, and positivity.
4. **Pill-shaped Components:** Buttons, badges, and primary inputs should lean towards fully rounded (pill-shaped) borders (`border-radius: 9999px`) to reinforce the friendly vibe.
5. **Adaptive Colors:** The system must fluidly support both Dark and Light modes using CSS variables, ensuring high contrast and accessibility in both environments.
6. **No Native Dialogs:** The entire project MUST use custom Modals or immersive UI patterns (like the toast container) for notifications and confirmations. STRICTLY DO NOT use `window.alert`, `window.confirm`, or `window.prompt` anywhere in the codebase.

## Tokens (Draft)

```css
:root {
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;

  /* Shape */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-pill: 9999px;

  /* Colors (Emerald Theme - Light Mode Default) */
  --primary: #10b981;
  --primary-hover: #059669;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  
  --bg-base: #f8fafc;
  --bg-surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --glass-border: rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Mode Overrides */
    --bg-base: #0f172a;
    --bg-surface: rgba(30, 41, 59, 0.4);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --glass-border: rgba(255, 255, 255, 0.1);
  }
}
```

## Next Steps

Now that the foundation is set, you can begin implementing these styles in your code. Once you have built out some UI components, re-run `/impeccable document` without the `--seed` flag to capture the actual CSS tokens, tonal ramps, and rendered component snippets!
