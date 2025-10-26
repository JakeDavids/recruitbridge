# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RecruitBridge is a college recruiting platform for student-athletes built with React, Vite, and the Base44 backend platform. The application helps athletes connect with college coaches through automated outreach, tracking, and profile management.

## Development Commands

### Installation and Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite development server (typically runs on http://localhost:5173)

### Build
```bash
npm run build
```
Creates a production build in the `dist/` directory

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality

### Preview Production Build
```bash
npm run preview
```
Previews the production build locally

## Architecture Overview

### Frontend Stack
- **Framework**: React 18 with Vite for fast development and building
- **Routing**: React Router DOM v7 for client-side routing
- **Styling**: Tailwind CSS with custom animations and gradients
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Icons**: Lucide React

### Backend Integration
- **BaaS Platform**: Base44 (Backend-as-a-Service)
- **SDK**: `@base44/sdk` for all backend operations
- **Authentication**: Google OAuth via Base44 Auth
- **App ID**: `6875a318a0b2d879d617363b`

### Key Architecture Patterns

#### 1. Base44 Client Setup
All backend communication goes through the Base44 client configured in `src/api/base44Client.js`:
- Centralized client with `requiresAuth: true`
- Entities and functions are exported from `src/api/entities.js` and `src/api/functions.js`

#### 2. Authentication Flow
- **Public routes**: `/` (landing), `/login`, `/signup`, `/pricing` - defined in `src/pages/Layout.jsx`
- **Protected routes**: All other routes require authentication
- **Auth check**: Layout component checks `User.me()` and redirects unauthenticated users to landing
- **Login**: `User.login()` triggers Google OAuth popup (no custom login form needed)
- **Logout**: `User.logout()` clears session

#### 3. Routing Structure
The app uses a two-level routing approach:
- **Layout wrapper** (`src/pages/Layout.jsx`): Handles auth checks and sidebar navigation
- **Page components** (`src/pages/*.jsx`): Individual feature pages
- **Route creation**: Use `createPageUrl(pageName)` utility from `src/utils` for consistent routing

#### 4. Data Entities (Base44)
Key entities accessed via `src/api/entities.js`:
- `Athlete` - Student athlete profiles
- `School` - College/university data
- `Coach` - College coach information
- `CoachContact` - Contact records with coaches
- `Outreach` - Email outreach campaigns
- `TargetedSchool` - Schools athlete is targeting
- `Mailbox` / `MailThread` / `Message` - Email inbox system
- `EmailIdentity` - Email aliases for sending (@recruitbridge.net addresses)
- `User` - Base44 auth (use `User.me()` to get current user)

#### 5. Backend Functions
Cloud functions accessed via `src/api/functions.js`:
- `sendEmail` / `sendEmailGmail` - Send outreach emails
- `inbox/*` - Inbox management operations
- `identity/*` - Email identity creation and validation
- `checkout` / `stripeWebhook` - Payment processing
- `claudeAssistant` / `api/claude/chat` - AI email generation

#### 6. Email Identity System
Custom hook `useRecruitBridgeIdentity` (`src/components/hooks/useRecruitBridgeIdentity.jsx`):
- Manages `@recruitbridge.net` email aliases for athletes
- Methods: `getMe()`, `checkUsername()`, `createIdentity()`
- Used for sending emails from branded domain

#### 7. Navigation Structure
Sidebar navigation defined in `src/pages/Layout.jsx`:
- **Main Navigation**: Dashboard, Target Schools, Coach Contacts, Outreach Center, Response Center, Coach Tracking, Coach Analytics, Action Plan, Questionnaires, Profile, 1-on-1 Counseling, Feedback
- **Resources Section**: Email Guide, Scholarships & NIL, My Recruiting Journey
- **Plan Badge**: Shows user's subscription tier (Free, Starter, Core, Unlimited)

## Important Implementation Details

### Path Aliasing
Vite is configured with `@/` alias pointing to `src/`:
```javascript
import { Button } from "@/components/ui/button"
import { User } from "@/api/entities"
```

### Component Organization
- `src/components/ui/` - Reusable UI components (shadcn/ui based on Radix)
- `src/components/dashboard/` - Dashboard-specific components
- `src/components/auth/` - Authentication-related components
- `src/components/identity/` - Email identity setup components
- `src/components/hooks/` - Custom React hooks
- `src/pages/` - Full page components (one per route)

### Styling Conventions
- Tailwind utility classes for all styling
- Custom gradients: `from-blue-600 via-indigo-600 to-purple-700` for hero sections
- Brand colors: Blue (#0046AD, #3B82F6), Yellow (#FBBF24, #FCD34D)
- Consistent spacing and rounded corners (`rounded-xl`, `rounded-2xl`)

### Public Pages vs. Protected Pages
- **Public pages** (no sidebar): Landing page renders full-width marketing content
- **Protected pages** (with sidebar): Dashboard and all athlete tools wrapped in Layout

### Data Loading Pattern
Most pages follow this pattern:
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const user = await User.me();
      const data = await Entity.filter({ created_by: user.email });
      setData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  loadData();
}, []);
```

### Forms and Validation
- Use React Hook Form for form state management
- Zod schemas for validation (@hookform/resolvers)
- shadcn/ui Form components for consistent styling

## Common Development Patterns

### Creating a New Page
1. Create new file in `src/pages/YourPage.jsx`
2. Add route to navigation in `src/pages/Layout.jsx` (navigationItems array)
3. Use `createPageUrl("YourPage")` for routing
4. Wrap page content in proper container with padding/margins

### Calling Backend Functions
```javascript
import { functionName } from "@/api/functions";

const result = await base44.functions.functionName({ param: value });
```

### Querying Data
```javascript
import { Entity } from "@/api/entities";

// Get all records
const all = await Entity.all();

// Filter records
const filtered = await Entity.filter({ field: value });

// Create record
const newRecord = await Entity.create({ field: value });

// Update record
await Entity.update(id, { field: newValue });
```

### Using Custom Hooks
The app includes custom hooks like `useRecruitBridgeIdentity` - check `src/components/hooks/` before creating similar functionality.

## Base44-Specific Notes

- Base44 handles authentication, database, and serverless functions
- No need to manage JWT tokens manually - SDK handles it
- Entity operations are async and return promises
- Use `User.me()` to get current authenticated user
- `created_by` field typically stores user's email for ownership
