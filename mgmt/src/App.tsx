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

  return (
    <div style={{ padding: '20px', border: '2px solid #FF9800', borderRadius: '8px' }}>
      <h1 style={{ color: '#FF9800' }}>Management Microfrontend</h1>
      {user && <div style={{ marginBottom: '10px', color: '#2ecc71' }}>Currently logged in as: {user.name}</div>}
      <p>This is the Management application (Port 5176).</p>
      <div className="card">
        <p>Current Path: <strong>{pathname}</strong></p>
        <p>System settings and user management.</p>
      </div>
    </div>
  )
}

export default App
