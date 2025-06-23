# Timer Application

## Overview

This is a sleek timer application built with React and TypeScript, featuring an iPhone-style scrollable time picker and comprehensive timer functionality. The application provides an intuitive interface for setting timers with support for hours, minutes, and seconds, along with timer management capabilities including pause, resume, and stop functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state management
- **Animation**: Framer Motion for smooth transitions and animations
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for bundling

### Data Storage Solutions
- **Database**: PostgreSQL 16 (configured but not yet implemented)
- **ORM**: Drizzle ORM with schema definitions
- **Current Storage**: In-memory storage implementation for development
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Key Components

### Timer Components
1. **TimerPicker**: iPhone-style scrollable time picker with hours, minutes, and seconds
2. **TimerDisplay**: Shows countdown with pause/resume/stop controls
3. **Timer Page**: Main timer interface managing all timer states

### Timer States
- `setup`: Initial state for setting timer duration
- `active`: Timer counting down
- `paused`: Timer temporarily stopped
- `expired`: Timer completed with post-expiration tracking

### UI Framework
- **Component Library**: Complete shadcn/ui implementation with Radix UI primitives
- **Theming**: Dark theme with CSS custom properties
- **Responsive Design**: Mobile-first approach with responsive utilities

## Data Flow

1. **Timer Setup**: User selects time using scrollable picker interface
2. **Timer Execution**: Countdown managed through React useEffect with intervals
3. **State Management**: Timer state transitions handled through React hooks
4. **Audio Feedback**: Browser audio API for timer completion notifications
5. **Post-Expiration Tracking**: Continues tracking elapsed time after timer expires

## External Dependencies

### Frontend Dependencies
- **UI Libraries**: @radix-ui components, class-variance-authority, clsx, tailwind-merge
- **Animation**: framer-motion for smooth transitions
- **Data Fetching**: @tanstack/react-query for future API integration
- **Form Handling**: react-hook-form with @hookform/resolvers
- **Utilities**: date-fns for date manipulation, cmdk for command interfaces

### Backend Dependencies
- **Database**: @neondatabase/serverless, drizzle-orm, drizzle-zod
- **Validation**: zod for schema validation
- **Session**: connect-pg-simple for session management

### Development Tools
- **Build**: vite, esbuild, tsx
- **Replit Integration**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20, PostgreSQL 16 modules
- **Development Server**: Vite dev server on port 5000
- **Hot Reload**: Enabled through Vite with runtime error overlay

### Production Deployment
- **Target**: Replit Autoscale deployment
- **Build Process**: Vite build for client, esbuild for server bundling
- **Static Assets**: Client built to dist/public, served by Express
- **Server**: Express serving both API and static files

### Database Strategy
- **Current**: In-memory storage for development
- **Planned**: PostgreSQL with Drizzle ORM migrations
- **Schema**: User management system prepared but not implemented

## Changelog

- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.