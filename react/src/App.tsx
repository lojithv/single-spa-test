import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLogin = (event: any) => {
      setUser(event.detail.user);
    };
    const handleLogout = () => {
      setUser(null);
    };
    
    const handleRouting = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('builderbid:auth:login', handleLogin);
    window.addEventListener('builderbid:auth:logout', handleLogout);
    window.addEventListener('single-spa:routing-event', handleRouting);
    window.addEventListener('popstate', handleRouting);

    return () => {
      window.removeEventListener('builderbid:auth:login', handleLogin);
      window.removeEventListener('builderbid:auth:logout', handleLogout);
      window.removeEventListener('single-spa:routing-event', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, []);

  const renderContent = () => {
    if (pathname.includes('/schedule')) {
      return (
        <div className="schedule-container">
          <h2>Project Schedule</h2>
          <p>This page is managed by <strong>React</strong>.</p>
          <div style={{ background: '#e8f4fd', padding: '20px', borderRadius: '8px' }}>
            <p>Gantt Chart View for Project: {pathname.split('/')[3]}</p>
            <ul>
              <li>Phase 1: Foundation (Completed)</li>
              <li>Phase 2: Framing (In Progress)</li>
              <li>Phase 3: Roofing (Upcoming)</li>
            </ul>
          </div>
          <button onClick={() => window.history.back()}>Back to Project Home (Angular)</button>
        </div>
      );
    }

    return (
      <div className="projects-container">
        <h1>My Projects</h1>
        <p>This Dashboard is managed by <strong>React</strong>.</p>
        {user && <div style={{ marginBottom: '10px', color: '#2ecc71' }}>Currently logged in as: {user.name}</div>}
        <div className="card">
          <p>Current Project: <strong>Single-SPA Migration</strong></p>
          <p>Status: In Progress</p>
          <a href="/app/project/123" onClick={(e) => { e.preventDefault(); (window as any).history.pushState(null, '', '/app/project/123'); }}>View Details (Angular)</a>
        </div>
      </div>
    );
  };

  return (
    <div className="react-app-wrapper">
      {renderContent()}
    </div>
  )
}

export default App
