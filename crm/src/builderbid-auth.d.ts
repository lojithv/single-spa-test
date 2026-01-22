/**
 * Type declarations for the builderbid-auth module (common app)
 * 
 * This module is loaded via import map from localhost:5173
 */
declare module 'builderbid-auth' {
  // Types
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

  // Store type
  interface Store<T> {
    getValue: () => T;
    setValue: (value: T) => void;
    subscribe: (listener: (value: T) => void) => () => void;
  }

  // Stores
  export const userStore: Store<User | null>;
  export const notificationsStore: Store<AppNotification[]>;
  export const themeStore: Store<'light' | 'dark'>;

  // Actions
  export function login(user: User): void;
  export function logout(): void;
  export function addNotification(type: AppNotification['type'], message: string): void;
  export function removeNotification(id: string): void;
  export function toggleTheme(): void;

  // Utilities
  export function isAuthenticated(): boolean;
  export function getToken(): string | null;
  export function setToken(token: string): void;
  export function clearToken(): void;

  // React Hooks
  export function useSharedUser(): User | null;
  export function useNotifications(): AppNotification[];
  export function useTheme(): 'light' | 'dark';
  export function useIsAuthenticated(): boolean;
  export function useStore<T>(store: Store<T>): T;

  // Single-spa lifecycle
  export function bootstrap(): Promise<void>;
  export function mount(): Promise<void>;
  export function unmount(): Promise<void>;
}
