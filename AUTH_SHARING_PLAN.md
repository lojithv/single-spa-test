# Plan: Sharing Auth & State in Single-SPA

This document outlines the strategy for sharing authentication tokens and common state across the `builderbid` microfrontend ecosystem, utilizing the **`auth` app** as the centralized state provider.

## 1. Development Workflow

Each developer team will run the following locally:
1.  **Root Shell** (Port 9000): Orchestrates the apps.
2.  **Auth App** (Port 5173): Provides the global UI shell (Appbar/Sidebar) AND serves as the utility module for auth/state.
3.  **Their Specific App**: (e.g., CRM on 5174, Angular on 4200, etc.)

## 2. Shared State Mechanism: Exporting from `auth`

Instead of a separate utility project, we will leverage the `builderbid-auth` microfrontend to export shared logic.

### Implementation in `auth/src/main.tsx`:
We will export a `user$` observable (RxJS) and utility functions directly from the entry point.

```typescript
// auth/src/main.tsx
import { BehaviorSubject } from 'rxjs';

// The source of truth for all apps
export const user$ = new BehaviorSubject(null);

export function getToken() {
  return localStorage.getItem('auth_token');
}

export const { bootstrap, mount, unmount } = lifecycles;
```

### Why this works?
Because `builderbid-auth` is in the import map, other apps can simply do:
```typescript
import { user$, getToken } from 'builderbid-auth';
```

---

## 3. Shared Info (User Profile, Preferences)

We will use **RxJS BehaviorSubject** within the `auth` app.

#### Why?
A `BehaviorSubject` always holds the "current" value. When a new microfrontend mounts (e.g., a user clicks "CRM"), the CRM app can immediately subscribe and get the latest user info without waiting for a new login event.

---

## 4. Framework-Specific Integration

### In React Apps:
Create a custom hook in each microfrontend (or shared via `auth`).
```tsx
import { user$ } from 'builderbid-auth';

export function useSharedUser() {
  const [user, setUser] = useState(user$.value);
  useEffect(() => {
    const sub = user$.subscribe(setUser);
    return () => sub.unsubscribe();
  }, []);
  return user;
}
```

### In Angular Apps:
Inject the shared observable directly from the `builderbid-auth` import.
```typescript
import { user$ } from 'builderbid-auth';

@Injectable({ providedIn: 'root' })
export class SharedAuthService {
  user$ = user$.asObservable();
}
```

---

## 5. Immediate Action Plan

1.  **Update `auth/src/main.tsx`**: Add RxJS and export the `user$` BehaviorSubject.
2.  **Update `auth/src/App.tsx`**: Make sure the `login` function updates the `user$` BehaviorSubject.
3.  **Refactor React/Angular Apps**: Replace local state listeners with subscriptions to the `auth` app's exports.

