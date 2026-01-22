/**
 * Shared State Store
 * 
 * This module provides a simple observable state store that can be imported
 * by any microfrontend via: import { ... } from 'builderbid-auth'
 * 
 * Uses a pub/sub pattern with callbacks (no external dependencies).
 */

// === Types ===
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

// === Simple Observable Store ===
type Listener<T> = (value: T) => void;

function createStore<T>(initialValue: T) {
  let currentValue = initialValue;
  const listeners = new Set<Listener<T>>();

  return {
    /** Get the current value */
    getValue: () => currentValue,

    /** Update the value and notify all subscribers */
    setValue: (newValue: T) => {
      currentValue = newValue;
      listeners.forEach(listener => listener(currentValue));
    },

    /** Subscribe to value changes. Returns an unsubscribe function. */
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      // Immediately call with current value
      listener(currentValue);
      // Return unsubscribe function
      return () => listeners.delete(listener);
    },
  };
}

// === Shared State Instances ===

/** Current authenticated user (null if not logged in) */
export const userStore = createStore<User | null>(null);

/** Global notifications/toasts */
export const notificationsStore = createStore<AppNotification[]>([]);

/** Theme preference */
export const themeStore = createStore<'light' | 'dark'>('light');

// === Convenience Functions ===

/** Login - set the current user */
export function login(user: User) {
  userStore.setValue(user);
  addNotification('success', `Welcome back, ${user.name}!`);
}

/** Logout - clear the current user */
export function logout() {
  const user = userStore.getValue();
  userStore.setValue(null);
  if (user) {
    addNotification('info', 'You have been logged out.');
  }
}

/** Add a notification */
export function addNotification(type: AppNotification['type'], message: string) {
  const notification: AppNotification = {
    id: crypto.randomUUID(),
    type,
    message,
    timestamp: Date.now(),
  };
  const current = notificationsStore.getValue();
  notificationsStore.setValue([...current, notification]);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification.id);
  }, 5000);
}

/** Remove a notification by ID */
export function removeNotification(id: string) {
  const current = notificationsStore.getValue();
  notificationsStore.setValue(current.filter(n => n.id !== id));
}

/** Toggle theme */
export function toggleTheme() {
  const current = themeStore.getValue();
  themeStore.setValue(current === 'light' ? 'dark' : 'light');
}

/** Check if user is authenticated */
export function isAuthenticated(): boolean {
  return userStore.getValue() !== null;
}

/** Get auth token from localStorage */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/** Set auth token in localStorage */
export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/** Clear auth token from localStorage */
export function clearToken(): void {
  localStorage.removeItem('auth_token');
}
