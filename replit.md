# Timer Application

## Overview

This is a full-stack timer application built with React, Express, and TypeScript. The application provides an iOS-style timer interface with functional scrollable time picking, countdown functionality, alarm sounds, and elapsed time tracking after completion. It features a modern UI using shadcn/ui components and Tailwind CSS, and is fully deployable to GitHub Pages with proper CSP configuration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks (useState, useEffect) with custom hooks
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful API structure (routes prefixed with /api)
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL 16 (configured but not yet implemented)
- **ORM**: Drizzle ORM for type-safe database operations
- **Current Storage**: In-memory storage implementation (MemStorage class)
- **Schema**: Defined in shared/schema.ts with user table structure

## Key Components

### Frontend Components
- **Timer Page**: Main timer interface with setup, running, paused, and completed states
- **TimePicker**: Custom iOS-style wheel picker for hours, minutes, and seconds
- **UI Components**: Comprehensive shadcn/ui component library including buttons, dialogs, forms, etc.

### Backend Components
- **Routes**: Express route handlers in server/routes.ts
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **Middleware**: Request logging, JSON parsing, and error handling

### Custom Hooks
- **useTimer**: Manages timer state, countdown logic, alarm functionality, and screen transitions
- **useToast**: Toast notification system
- **useMobile**: Mobile device detection

## Data Flow

1. **Timer Setup**: User selects time using TimePicker component
2. **Timer Execution**: useTimer hook manages countdown with setInterval
3. **State Management**: Timer states (setup, running, paused, completed) control UI rendering
4. **Audio Feedback**: Web Audio API generates alarm sounds when timer completes
5. **Persistence**: Currently in-memory, designed for future database integration

## External Dependencies

### Production Dependencies
- **UI Framework**: React, React DOM
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Components**: Radix UI primitives, shadcn/ui components
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Server**: Express.js, connect-pg-simple
- **Utilities**: date-fns, nanoid, zod

### Development Tools
- **Build**: Vite, esbuild
- **TypeScript**: Full type safety across frontend and backend
- **Development**: tsx for server development, Replit integration

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Port**: 5000 (mapped to external port 80)
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend

### Production Build
- **Frontend**: Vite builds to dist/public
- **Backend**: esbuild bundles server to dist/index.js
- **Start**: `npm run start` runs the production build

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Workflows**: Parallel execution with automatic port detection

## Changelog

- June 26, 2025: Added GitHub Pages deployment configuration with CSP headers
- June 26, 2025: Integrated working TimePicker from successful GitHub repository
- June 26, 2025: Fixed timer functionality with proper alarm system and elapsed time tracking
- June 24, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.