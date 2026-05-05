# Frontend Page Architecture

To ensure high maintainability, code reuse, and a clean abstraction layer, all pages in this Next.js project should adhere to a strict component composition architecture based on the modern App Router conventions.

## General Directory Structure

For any given route (e.g., `/dashboard`, `/profile`), the folder architecture should be broken down as follows:

```text
app/
├── [route-name]/
│   ├── components/
│   │   ├── FeatureForm.tsx      # Complex state, user inputs, and interactions
│   │   └── LayoutPanel.tsx      # Huge structural UI like side panels, quotes, or visuals
│   ├── utils/                   
│   │   └── helper.ts            # (Optional) Functions, API connectors, specific to this route
│   └── page.tsx                 # Strict composition layer (minimum logic)
```

## Sections Folder Organization

For standalone homepage or dashboard sections, use a folder-level architecture that mirrors route structure and keeps visuals, interactions, and section-specific logic together.

```text
sections/
├── Hero/
│   ├── components/            # Visual building blocks for the section
│   │   ├── HeroPromoBadge.tsx
│   │   ├── HeroActions.tsx
│   │   ├── HeroStats.tsx
│   │   └── HeroVisual.tsx
│   ├── utils/                 # Section-specific data and helpers
│   │   └── heroData.ts
│   └── index.tsx              # Section composition layer
├── CartSection/
│   ├── components/
│   │   └── CartGrid.tsx
│   ├── utils/
│   │   └── cartData.ts
│   └── index.tsx
└── ...
```

This keeps each section modular:
- `components/` contains the reusable pieces used only by that section.
- `utils/` holds data arrays, formatting helpers, and section-specific logic.
- `index.tsx` stays as the section composition layer, not the implementation detail container.

## Core Principles

### 1. Logicless Pages (`page.tsx`)
The `page.tsx` file must act strictly as a layout skeleton. Its primary job is to assemble local and global components into a responsive layout.
* **Avoid**: Writing 500 lines of `useState`, form handling, and inline JSX elements inside `page.tsx`.
* **Embrace**: Returning high-level components like `<DashboardContainer><Sidebar /><MainFeed /></DashboardContainer>`.

### 2. Isolate Visuals vs Form State 
You must separate complex structural DOM trees from sensitive interactive states:
- Forms, inputs, and interactive widgets must be extracted into their own specialized components inside `/components` to limit re-renders.
- Massive visual blocks (e.g., tall layouts, wavy dividers, promotional quotes) should be isolated so structural adjustments don't require surfing through state management logic.

### 3. Local Utilities over Global Clutter
If a helper function or API logic is only used by one specific page, store it in `app/[route-name]/utils/`. If it begins being reused by fundamentally separate pages, move it to the global `@/lib/` or global `@/utils/` directory.

---

### Implementation Example (Auth Pages)
This structure was actively deployed to the `/signup` and `/login` routes:
- **State encapsulation**: `SignupForm.tsx` securely holds all password and email state.
- **Visual encapsulation**: `SignupLeftPanel.tsx` holds the complex wave styling and quotes statically.
- **Composition**: `page.tsx` simply renders the two components as a flexbox split.
