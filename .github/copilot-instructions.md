# AI Archivist - AI Agent Instructions

This document provides essential context for AI agents working in this codebase.

## Architecture Overview

AI Archivist is an Electron-based desktop application for archiving conversations from various AI platforms. Key components:

- **Frontend (`App.tsx`)**: React-based UI with a dashboard, adapters view, settings, and docs
- **Backend (`electron/*.js`)**: 
  - `archiver.js`: Core archiving logic
  - `database.js`: SQLite storage for conversations
  - `scraper.js`: Platform-specific conversation extraction

### Data Flow
1. User selects platforms and export formats in UI
2. Frontend triggers archive job via IPC
3. Backend scrapes conversations and writes to both database and export files
4. Progress and logs stream back to UI via IPC events

## Key Patterns

### Platform Integration
- Platforms are defined in `types.ts` with status tracking and adapter versioning
- Each platform requires a scraper implementation in `electron/scraper.js`
- Reference `electron/archiver.js` for the platform integration contract

### State Management 
- Component state managed via React hooks in `App.tsx`
- IPC communication bridged through `ipcApi.ts`
- Platform status updates flow through the `PlatformStatus` enum

### Export Pipeline
1. Archive jobs process platforms sequentially
2. Conversations stored in SQLite and optionally exported as:
   - Markdown (`.md`)
   - JSONL (`.jsonl`) 
   - ZIP (`.zip`)

## Development Workflow

### Setup
```bash
npm install
npm run dev  # Starts both Electron and React dev servers
```

### Key Files for Common Tasks
- Add new platform: Update `types.ts` and implement scraper in `electron/scraper.js`
- Modify export formats: See `ExportFormat` enum in `types.ts`
- UI components: Check `components/` directory for reusable elements

### Testing
- No automated tests yet - manual testing through the UI
- Test archive runs with small conversation counts first

## Cross-Component Communication

- Frontend → Backend: IPC calls defined in `ipcApi.ts`
- Backend → Frontend: Events for logs, progress, and job completion
- Component → Component: Props and callback patterns (see `PlatformTile.tsx`)

## Configuration
- Default platforms configured in `App.tsx`
- User settings persisted via `electron/database.js`
- Environment variables loaded from `.env.local`