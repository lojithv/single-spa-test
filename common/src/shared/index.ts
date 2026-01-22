/**
 * Shared State Exports
 * 
 * This file re-exports all shared state for use by other microfrontends.
 * It has no side effects and can be safely imported during build.
 */

// Export from store
export {
  // Stores
  userStore,
  notificationsStore,
  themeStore,
  // Actions
  login,
  logout,
  addNotification,
  removeNotification,
  toggleTheme,
  // Utilities
  isAuthenticated,
  getToken,
  setToken,
  clearToken,
  // Types
  type User,
  type AppNotification,
} from './store';

// Export hooks
export {
  useSharedUser,
  useNotifications,
  useTheme,
  useIsAuthenticated,
  useStore,
} from './hooks';
