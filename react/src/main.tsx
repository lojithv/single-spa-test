import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App.tsx';
import './index.css';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return <div style={{ color: 'red' }}>Error in React App: {err.message}</div>;
  },
});

// Detection for Standalone Mode
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
