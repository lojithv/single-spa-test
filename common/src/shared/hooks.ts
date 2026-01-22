/**
 * React Hooks for Shared State
 * 
 * These hooks make it easy for React microfrontends to consume the shared state.
 * Import via: import { useSharedUser, useNotifications } from 'builderbid-auth'
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  userStore, 
  notificationsStore, 
  themeStore,
  type User,
  type AppNotification,
} from './store';

/**
 * Hook to get and subscribe to the current user
 * @returns The current user or null if not authenticated
 */
export function useSharedUser(): User | null {
  const [user, setUser] = useState<User | null>(userStore.getValue());

  useEffect(() => {
    const unsubscribe = userStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  return user;
}

/**
 * Hook to get and subscribe to notifications
 * @returns Array of current notifications
 */
export function useNotifications(): AppNotification[] {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    notificationsStore.getValue()
  );

  useEffect(() => {
    const unsubscribe = notificationsStore.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return notifications;
}

/**
 * Hook to get and subscribe to theme
 * @returns Current theme ('light' | 'dark')
 */
export function useTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>(themeStore.getValue());

  useEffect(() => {
    const unsubscribe = themeStore.subscribe(setTheme);
    return unsubscribe;
  }, []);

  return theme;
}

/**
 * Hook to check if user is authenticated
 * @returns Boolean indicating if user is logged in
 */
export function useIsAuthenticated(): boolean {
  const user = useSharedUser();
  return user !== null;
}

/**
 * Generic hook for subscribing to any store
 */
export function useStore<T>(store: { 
  getValue: () => T; 
  subscribe: (listener: (value: T) => void) => () => void;
}): T {
  const [value, setValue] = useState<T>(store.getValue());

  useEffect(() => {
    const unsubscribe = store.subscribe(setValue);
    return unsubscribe;
  }, [store]);

  return value;
}
