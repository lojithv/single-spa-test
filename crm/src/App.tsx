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

  const navigateTo = (path: string) => {
    (window as any).history.pushState(null, '', path);
  };

  const renderContent = () => {
    if (pathname.includes('/companies/')) {
      const companyId = pathname.split('/')[4];
      const isChat = pathname.includes('/chat');
      const isNotes = pathname.includes('/notes');

      return (
        <div>
          <h2>Company: {companyId}</h2>
          <nav>
            <button onClick={() => navigateTo(`/app/crm/companies/${companyId}`)}>Details</button>
            <button onClick={() => navigateTo(`/app/crm/companies/${companyId}/chat`)}>Chat</button>
            <button onClick={() => navigateTo(`/app/crm/companies/${companyId}/notes`)}>Notes</button>
          </nav>
          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0' }}>
            {isChat ? <p>Company Chat messages would appear here...</p> : 
             isNotes ? <p>Internal notes about this company...</p> : 
             <p>General company details, address, and contact info.</p>}
          </div>
          <button onClick={() => navigateTo('/app/crm/companies')}>Back to Companies</button>
        </div>
      );
    }

    if (pathname === '/app/crm/companies') {
      return (
        <div>
          <h2>Companies</h2>
          <ul>
            <li onClick={() => navigateTo('/app/crm/companies/ACME')}>ACME Corp</li>
            <li onClick={() => navigateTo('/app/crm/companies/Globex')}>Globex Corp</li>
          </ul>
        </div>
      );
    }

    return (
      <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px' }}>
        <h1 style={{ color: '#4CAF50' }}>CRM Microfrontend</h1>
        {user && <div style={{ marginBottom: '10px', color: '#2ecc71' }}>Currently logged in as: {user.name}</div>}
        <p>This is the CRM application (Port 5174).</p>
        <div className="card">
          <p>Manage your customer relationships here.</p>
          <button onClick={() => navigateTo('/app/crm/companies')}>View Companies</button>
        </div>
      </div>
    );
  };

  return (
    <div className="crm-app-wrapper">
      {renderContent()}
    </div>
  )
}

export default App
