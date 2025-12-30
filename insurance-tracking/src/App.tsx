import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const handleLogin = (event: any) => {
      setUser(event.detail.user);
    };
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('builderbid:auth:login', handleLogin);
    window.addEventListener('builderbid:auth:logout', handleLogout);

    return () => {
      window.removeEventListener('builderbid:auth:login', handleLogin);
      window.removeEventListener('builderbid:auth:logout', handleLogout);
    };
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #2196F3', borderRadius: '8px' }}>
      <h1 style={{ color: '#2196F3' }}>Insurance Tracking Microfrontend</h1>
      {user && <div style={{ marginBottom: '10px', color: '#2ecc71' }}>Currently logged in as: {user.name}</div>}
      <p>This is the Insurance Tracking application (Port 5175).</p>
      <div className="card">
        <p>Monitor and manage insurance policies.</p>
      </div>
    </div>
  )
}

export default App
