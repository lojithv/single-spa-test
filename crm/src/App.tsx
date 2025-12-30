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
    <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px' }}>
      <h1 style={{ color: '#4CAF50' }}>CRM Microfrontend</h1>
      {user && <div style={{ marginBottom: '10px', color: '#2ecc71' }}>Currently logged in as: {user.name}</div>}
      <p>This is the CRM application (Port 5174).</p>
      <div className="card">
        <p>Manage your customer relationships here.</p>
      </div>
    </div>
  )
}

export default App
