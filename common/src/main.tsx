import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App.tsx';
import './index.css';

// ============================================================
// SHARED EXPORTS - Other microfrontends import from 'builderbid-auth'
// ============================================================

// Export the store and all its functions
export {
  // Stores (for direct access)
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
} from './shared/store';

// Export React hooks for easy consumption
export {
  useSharedUser,
  useNotifications,
  useTheme,
  useIsAuthenticated,
  useStore,
} from './shared/hooks';

// ============================================================
// SINGLE-SPA LIFECYCLE
// ============================================================

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err, _info, _props) {
    return <div style={{ color: 'red' }}>Error in Common Shell: {err.message}</div>;
  },
});

// Standalone mode for development
if (!(window as any).singleSpaNavigate) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOMClient.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

export const { bootstrap, mount, unmount } = lifecycles;
