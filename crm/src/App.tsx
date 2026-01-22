import { useState, useEffect } from 'react'
import './App.css'

// ============================================================
// IMPORT SHARED STATE FROM COMMON APP
// ============================================================
// These are imported from 'builderbid-auth' which is the common app
// The import map in root/src/index.ejs maps this to localhost:5173
import { 
  useSharedUser,        // Hook to get current user
  addNotification,      // Function to show notifications
  type User             // User type
} from 'builderbid-auth';

function App() {
  // Use shared user state - automatically subscribes to changes!
  // When user logs in/out in the common app, this updates automatically
  const user = useSharedUser();
  
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouting = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('single-spa:routing-event', handleRouting);
    window.addEventListener('popstate', handleRouting);

    return () => {
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
        
        {/* Show user info from shared state */}
        {user ? (
          <div style={{ marginBottom: '15px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
            <strong>Logged in as:</strong> {user.name} ({user.email})
            <br />
            <strong>Roles:</strong> {user.roles.join(', ')}
          </div>
        ) : (
          <div style={{ marginBottom: '15px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
            Not logged in. Please log in from the shell.
          </div>
        )}
        
        <p>This is the CRM application (Port 5174).</p>
        
        <div className="card">
          <p>Manage your customer relationships here.</p>
          <button onClick={() => navigateTo('/app/crm/companies')}>View Companies</button>
          
          {/* Demo: Send notification to shell */}
          <button 
            onClick={() => addNotification('success', 'Hello from CRM! This notification appears in the shell.')}
            style={{ marginLeft: '10px', background: '#2196F3' }}
          >
            Send Notification to Shell
          </button>
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
