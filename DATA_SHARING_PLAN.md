# Microfrontend Data Sharing Plan

This document describes how to share state between microfrontends in the BuilderBid architecture. The **common app** (formerly auth) serves as the central state provider.

## Status: IMPLEMENTED

The following files have been created/updated:
- `common/src/shared/store.ts` - Core state store with pub/sub pattern
- `common/src/shared/hooks.ts` - React hooks for consuming state
- `common/src/main.tsx` - Exports shared API for other apps
- `crm/src/builderbid-auth.d.ts` - TypeScript declarations for CRM app

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   Common App (Port 5173)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   State Store   │  │  Notifications  │  │  Exported API   │  │
│  │  (userStore)    │  │ (pub/sub)       │  │                 │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            └────────────────────┴────────────────────┘
                                 │
                    import from 'builderbid-auth'
                                 │
       ┌─────────────┬───────────┼───────────┬─────────────┐
       ▼             ▼           ▼           ▼             ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
 │  Angular │ │   CRM    │ │Insurance │ │   MGMT   │ │ Projects │
 │  :4200   │ │  :5174   │ │  :5175   │ │  :5176   │ │  :5177   │
 └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

## Data Sharing Patterns

### Pattern 1: State Subjects (for persistent state)
Use RxJS `BehaviorSubject` for data that needs a "current value" (auth, user preferences, selected context).

### Pattern 2: Event Bus (for real-time updates)
Use RxJS `Subject` for fire-and-forget events (notifications, data refresh signals, cross-app actions).

---

## Implementation

### Step 1: Create Shared State/Event Module

Create a new file `auth/src/shared/event-bus.ts`:

```typescript
import { BehaviorSubject, Subject, filter, map } from 'rxjs';

// === TYPES ===
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface Preferences {
  theme: 'light' | 'dark';
  language: string;
}

interface AppEvent {
  type: string;
  payload?: unknown;
  source: string;  // which app emitted
}

// === STATE SUBJECTS (persistent state with current value) ===
export const user$ = new BehaviorSubject<User | null>(null);
export const preferences$ = new BehaviorSubject<Preferences>({ theme: 'light', language: 'en' });

// === EVENT BUS (real-time events) ===
const eventBus$ = new Subject<AppEvent>();

// Publish an event
export function emit(type: string, payload?: unknown, source = 'unknown') {
  eventBus$.next({ type, payload, source });
}

// Subscribe to specific event types
export function on<T = unknown>(eventType: string) {
  return eventBus$.pipe(
    filter(event => event.type === eventType),
    map(event => event.payload as T)
  );
}

// Subscribe to all events (for debugging)
export const allEvents$ = eventBus$.asObservable();
```

### Step 2: Define Event Types

Create `auth/src/shared/event-types.ts`:

```typescript
export const Events = {
  // Auth events
  USER_LOGGED_IN: 'auth:user-logged-in',
  USER_LOGGED_OUT: 'auth:user-logged-out',
  TOKEN_REFRESHED: 'auth:token-refreshed',
  
  // Cross-app notifications
  NOTIFICATION: 'app:notification',
  DATA_REFRESH: 'app:data-refresh',
  
  // Navigation hints
  NAVIGATE_TO: 'nav:navigate-to',
  
  // Business events
  PROJECT_UPDATED: 'project:updated',
  PROJECT_SELECTED: 'project:selected',
  COMPANY_UPDATED: 'crm:company-updated',
} as const;

export type EventType = typeof Events[keyof typeof Events];
```

### Step 3: Create Auth Utilities

Create `auth/src/shared/auth-utils.ts`:

```typescript
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
```

### Step 4: Update Auth Main Entry Point

Modify `auth/src/main.tsx` to export the shared API:

```typescript
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

// Re-export shared state and event bus
export { user$, preferences$, emit, on, allEvents$ } from './shared/event-bus';
export { Events } from './shared/event-types';
export { getToken, setToken, clearToken, isAuthenticated } from './shared/auth-utils';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary() {
    return <div>Auth App Error</div>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
```

### Step 5: Add RxJS Dependency to Auth

```bash
cd auth && yarn add rxjs
```

---

## Framework Integration

### React Apps (CRM, Insurance, MGMT, Projects)

Create a shared hook for event subscription:

```typescript
// hooks/useEvent.ts
import { useEffect, useCallback } from 'react';
import { on } from 'builderbid-auth';

export function useEvent<T>(eventType: string, handler: (payload: T) => void) {
  const stableHandler = useCallback(handler, [handler]);
  
  useEffect(() => {
    const subscription = on<T>(eventType).subscribe(stableHandler);
    return () => subscription.unsubscribe();
  }, [eventType, stableHandler]);
}
```

Create a hook for shared user state:

```typescript
// hooks/useSharedUser.ts
import { useState, useEffect } from 'react';
import { user$ } from 'builderbid-auth';

export function useSharedUser() {
  const [user, setUser] = useState(user$.value);
  
  useEffect(() => {
    const subscription = user$.subscribe(setUser);
    return () => subscription.unsubscribe();
  }, []);
  
  return user;
}
```

**Usage in a React component:**

```tsx
import { useEvent, useSharedUser } from './hooks';
import { emit, Events } from 'builderbid-auth';

function ProjectList() {
  const user = useSharedUser();
  
  // Listen for project updates from other apps
  useEvent(Events.PROJECT_UPDATED, (project) => {
    console.log('Project updated:', project);
    // Refresh local data
  });
  
  const handleSave = (project) => {
    // Save project...
    
    // Notify other apps
    emit(Events.PROJECT_UPDATED, project, 'projects');
  };
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### Angular App

Create a service to integrate with the shared event bus:

```typescript
// src/app/services/shared-events.service.ts
import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { on, emit, user$, Events } from 'builderbid-auth';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedEventsService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  
  constructor(private ngZone: NgZone) {}
  
  // Expose user state as observable
  get user$(): Observable<any> {
    return user$.asObservable();
  }
  
  // Subscribe to events (runs change detection)
  onEvent<T>(eventType: string, callback: (payload: T) => void): Subscription {
    const sub = on<T>(eventType).subscribe(payload => {
      // Run inside Angular zone to trigger change detection
      this.ngZone.run(() => callback(payload));
    });
    this.subscriptions.push(sub);
    return sub;
  }
  
  // Emit events to other apps
  emit(type: string, payload?: unknown): void {
    emit(type, payload, 'angular');
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
```

**Usage in an Angular component:**

```typescript
import { Component, OnInit } from '@angular/core';
import { SharedEventsService } from './services/shared-events.service';
import { Events } from 'builderbid-auth';

@Component({
  selector: 'app-templates',
  template: `
    <h1>Welcome, {{ (user$ | async)?.name }}</h1>
    <button (click)="saveTemplate()">Save</button>
  `
})
export class TemplatesComponent implements OnInit {
  user$ = this.sharedEvents.user$;
  
  constructor(private sharedEvents: SharedEventsService) {}
  
  ngOnInit() {
    this.sharedEvents.onEvent(Events.DATA_REFRESH, () => {
      this.loadTemplates();
    });
  }
  
  saveTemplate() {
    // Save template...
    
    // Notify other apps
    this.sharedEvents.emit(Events.PROJECT_UPDATED, { id: 123 });
  }
  
  private loadTemplates() {
    // Refresh data...
  }
}
```

---

## Example Use Cases

| Scenario | Pattern | Code Example |
|----------|---------|--------------|
| User logs in | State Subject | `user$.next(userData)` - all apps receive update |
| Project saved in Angular | Event Bus | `emit(Events.PROJECT_UPDATED, project)` - Projects app refreshes |
| Show toast notification | Event Bus | `emit(Events.NOTIFICATION, { message: 'Saved!', type: 'success' })` |
| Token expired | Event Bus | `emit(Events.USER_LOGGED_OUT)` - all apps clear local state |
| User selects a project | State Subject | Create `selectedProject$` BehaviorSubject |

---

## File Structure After Implementation

```
auth/src/
├── shared/
│   ├── event-bus.ts        # Core event bus and state subjects
│   ├── event-types.ts      # Event type constants
│   └── auth-utils.ts       # Token helpers (getToken, setToken)
├── hooks/
│   ├── useEvent.ts         # React hook for event subscription
│   └── useSharedUser.ts    # React hook for user state
├── App.tsx
└── main.tsx                # Re-exports shared API

angular/src/app/services/
└── shared-events.service.ts  # Angular service for event integration
```

---

## Debugging

Add a debug mode to log all events during development. Add this to the auth app initialization:

```typescript
// In auth/src/App.tsx or a setup file
import { allEvents$ } from './shared/event-bus';

if (import.meta.env.DEV) {
  allEvents$.subscribe(event => {
    console.log(`[EventBus] ${event.source} -> ${event.type}`, event.payload);
  });
}
```

You can also add a debug panel to visualize events in development:

```typescript
// Optional: Create a DevTools component
function EventBusDevTools() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  useEffect(() => {
    const sub = allEvents$.subscribe(event => {
      setEvents(prev => [...prev.slice(-50), event]); // Keep last 50
    });
    return () => sub.unsubscribe();
  }, []);
  
  if (!import.meta.env.DEV) return null;
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, maxHeight: 200, overflow: 'auto' }}>
      {events.map((e, i) => (
        <div key={i}>{e.source}: {e.type}</div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Use descriptive event types**: Prefix with the domain (e.g., `auth:`, `project:`, `crm:`)
2. **Include source in events**: Helps debugging and prevents infinite loops
3. **Unsubscribe on unmount**: Always clean up subscriptions to prevent memory leaks
4. **Use BehaviorSubject for state**: When you need the "current value" immediately
5. **Use Subject for events**: When you only care about future emissions
6. **Run Angular callbacks in NgZone**: Ensures change detection triggers properly
