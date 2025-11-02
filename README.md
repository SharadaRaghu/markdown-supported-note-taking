# markdown-supported-note-taking

Note-taking app built with React, TypeScript and Vite. Supports creating, editing, tagging, and filtering notes with Markdown rendering.

This README provides a high-level overview, how to run the project, and a detailed per-file analysis describing what happens in each important file so you (or a collaborator) can quickly find and understand functionality.

## Quick start

Prerequisites
- Node.js (LTS) and npm

Install dependencies
```bash
npm install
```

Run in development
```bash
npm start
```

Build for production
```bash
npm run build
```

## Features
- Create, edit, delete notes
- Add and manage tags (create tags inline)
- Filter notes by title and tags
- Markdown rendering for note bodies (via `react-markdown`)
- Responsive UI using React Bootstrap
- Tag input via `react-select` (creatable)

## Project structure (high level)

Top-level files
- `package.json` — npm scripts and dependencies
- `vite.config.ts` — Vite configuration
- `tsconfig.json` / `tsconfig.app.json` — TypeScript configuration
- `README.md` — this file

src/
- `main.tsx` — React entry, renders the app
- `App.tsx` — top-level routes and shared state for notes and tags (central source of truth)
- `NoteList.module.css` — CSS Module used by the notes list
- `assets/` — static assets
- `components/`
  - `NoteForm.tsx` — form used in new/edit note pages (integrates creatable react-select)
  - `NoteLayout.tsx` — layout and hooks for note routes (provides `useNote` etc.)
- `hooks/`
  - `UseLocalStorage.tsx` — custom hook that persists state to localStorage
- `pages/`
  - `NoteList.tsx` — list view with filtering and tag editor modal
  - `NewNote.tsx` — page that uses `NoteForm` to create a note
  - `EditNote.tsx` — page that uses `NoteForm` to edit an existing note
  - `Note.tsx` — view a single note (renders markdown and tag badges)

## Detailed per-file analysis

Below is a focused explanation of what each important file does and how the pieces interact. This is meant as a reference while reading the code.

### src/main.tsx
- Purpose: Application entry point. Mounts the React app into the DOM and wraps it with any providers (e.g., BrowserRouter).
- Key responsibilities: import global CSS, render `<App />` inside a router.

### src/App.tsx
- Purpose: Central application state and routing.
- What it contains:
  - State for notes and tags. The app keeps notes and available tags in memory (and usually uses `UseLocalStorage` to persist them).
  - Routes using React Router for `/`, `/new`, `/:id`, and `/:id/edit`.
  - Functions passed to pages/components as props to create, update, and delete notes and tags.
- How it interacts with others: Passes `onAddTag`, `availableTags`, and note state down to `NoteForm` and `NoteList`.

### src/hooks/UseLocalStorage.tsx
- Purpose: Custom hook to persist state to `localStorage`.
- API: Exposes a pair `[value, setValue]` similar to `useState`, but writes changes to localStorage and initializes from it.
- Where used: Typically in `App.tsx` to persist notes and tags across reloads.

### src/components/NoteForm.tsx
- Purpose: The form component used by `NewNote` and `EditNote` pages.
- Key behavior:
  - Collects `title`, `markdown` and `tags` from user input.
  - Uses React refs (`titleRef`, `markdownRef`) to read form values on submit.
  - Integrates `react-select/creatable` (imported as `CreatableReactSelect`) to select or create tags inline.
  - Maps between internal Tag objects (`{ id, label }`) and react-select option shape (`{ value, label }`). Specifically:
    - The `value` prop is computed as `selectedTags.map(t => ({ label: t.label, value: t.id }))`.
    - The `onChange` handler converts the react-select option objects back into internal tags `({ label, id: value })` and updates local state.
  - When a new option is created, `onCreateOption` generates a UUID, calls `onAddTag`, and adds it to `selectedTags`.
- Notes / gotchas:
  - The `react-select` value can be `null` when nothing is selected; handlers should guard against this case.
  - For TypeScript, the import `react-select/creatable` may need an explicit module declaration if the shipped types don't include that path.

### src/components/NoteLayout.tsx
- Purpose: Helper component that provides consistent layout and route-level data for single-note pages.
- Exposes `useNote` hook (or context) that fetches the note object based on route params (id) and is used by `Note.tsx`, `EditNote.tsx`.

### src/pages/NoteList.tsx
- Purpose: Main list view showing all notes, searching and tag filtering.
- Key behavior:
  - Local state: `selectedTags` (for filtering) and `title` (search text).
  - Renders a `ReactSelect` (non-creatable in this file) for selecting multiple tags to filter the list.
  - Maps internal `Tag` shape to select options and back again on change (same pattern as `NoteForm`).
  - `filteredNotes` is computed with `useMemo` and filters notes by matching title substring (case-insensitive) and ensuring every selected tag is present on the note.
  - Renders `NoteCard` entries and exposes an Edit Tags modal that allows renaming or deleting available tags.

### src/pages/Note.tsx
- Purpose: View a single note.
- Key behavior:
  - Uses `useNote()` (from `NoteLayout`) to retrieve the note for the current route.
  - Renders the note title, tags as `Badge` components, and the markdown body rendered by `react-markdown`.
  - Provides buttons to edit, delete and navigate back. Delete calls a prop `onDeleteNote(id)` and navigates home.

### src/pages/NewNote.tsx and src/pages/EditNote.tsx
- Purpose: Wrapper pages around `NoteForm`.
- `NewNote` passes an `onSubmit` that creates a new note (generates id, stores note, redirects to list).
- `EditNote` loads an existing note via `useNote`, passes current note data as default values, and `onSubmit` updates the existing note.

### src/NoteList.module.css
- Purpose: Styles scoped to the `NoteList` component via CSS Modules.
- Usage: `import styles from '../NoteList.module.css'` then refer to `styles.card` etc.
- TypeScript note: TypeScript needs a declaration for `*.module.css` to allow `import styles from '...module.css'`. Create `src/custom.d.ts` with:

```ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## Troubleshooting and common fixes

- Cannot find module 'react-select/creatable' or its types
  - Ensure `react-select` is installed: `npm install react-select`
  - Add community types: `npm install --save-dev @types/react-select`
  - If TypeScript still complains about the `/creatable` path, add a module declaration (`src/custom.d.ts`):

```ts
declare module 'react-select/creatable' {
  import { ComponentType } from 'react';
  const Creatable: ComponentType<any>;
  export default Creatable;
}
```

- CSS Modules typing error (Property 'card' does not exist...)
  - Add the `*.module.css` declaration above (`src/custom.d.ts`) so imports like `import styles from '../NoteList.module.css'` type-check.

## Developer notes and small improvements
- Consider centralizing shared types (Note, NoteData, Tag) in a single file (e.g., `src/types.ts`) and import them across components.
- Memoize mapped option arrays and wrap select handlers in `useCallback` to avoid unnecessary re-renders when passing option arrays/handlers to `react-select`.
- Add a minimal test or storybook story for `NoteForm` to verify tag creation mapping.

## Where to look next (orientation pointers)
- If you're editing tag behavior, open `src/components/NoteForm.tsx` and `src/pages/NoteList.tsx` to see the mapping between `{ id, label }` and `{ value, label }`.
- To change persistence, edit `src/hooks/UseLocalStorage.tsx` or replace it with an API-backed implementation in `App.tsx`.
- For styling tweaks, update `src/NoteList.module.css` and any bootstrap overrides in `index.css` or global styles.

