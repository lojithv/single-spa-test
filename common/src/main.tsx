import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App.tsx';
import './index.css';

// ============================================================
// SHARED EXPORTS - Other microfrontends import from 'builderbid-auth'
// ============================================================
// Re-export everything from the shared index (keeps this DRY)
export * from './shared/index';

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
