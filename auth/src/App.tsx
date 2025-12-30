import { useState, useEffect, createContext, useContext } from 'react'
import './App.css'

// Simple Auth Context
const AuthContext = createContext<{
  user: { name: string } | null;
  login: () => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handleRouting = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('single-spa:routing-event', handleRouting);
    window.addEventListener('popstate', handleRouting);

    handleRouting();

    return () => {
      window.removeEventListener('single-spa:routing-event', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, []);

  const login = () => {
    const newUser = { name: 'John Doe' };
    setUser(newUser);
    window.dispatchEvent(new CustomEvent('builderbid:auth:login', { detail: { user: newUser } }));
    navigateTo('/');
  };
  
  const logout = () => {
    setUser(null);
    window.dispatchEvent(new CustomEvent('builderbid:auth:logout'));
    navigateTo('/login');
  };

  const navigateTo = (path: string) => {
    if ((window as any).singleSpaNavigate) {
      (window as any).history.pushState(null, '', path);
    } else {
      window.location.href = path;
    }
  };

  const renderContent = () => {
    if (pathname === '/login') {
      return (
        <div className="full-page-auth">
          <div className="auth-card">
            <h2>Login</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={login}>Login</button>
            <p>Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigateTo('/signup'); }}>Sign up</a></p>
          </div>
        </div>
      );
    }

    if (pathname === '/signup') {
      return (
        <div className="full-page-auth">
          <div className="auth-card">
            <h2>Sign Up</h2>
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={() => navigateTo('/login')}>Create Account</button>
            <p>Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }}>Login</a></p>
          </div>
        </div>
      );
    }

    return (
      <div className="auth-shell">
        <header className="appbar">
          <div className="brand">BuilderBid Shell</div>
          <div className="user-profile">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Welcome, {user.name}</span>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <button onClick={() => navigateTo('/login')}>Login</button>
            )}
          </div>
        </header>
        
        <nav className="sidebar">
          <ul>
            <li>
              <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>Home</a>
            </li>
            <li>
              <a href="/app/inventory" onClick={(e) => { e.preventDefault(); navigateTo('/app/inventory'); }}>Inventory (Angular)</a>
            </li>
            <li>
              <a href="/app/projects" onClick={(e) => { e.preventDefault(); navigateTo('/app/projects'); }}>Projects (React)</a>
            </li>
            <li style={{ marginTop: '15px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <strong>Services</strong>
            </li>
            <li>
              <a href="/app/crm" onClick={(e) => { e.preventDefault(); navigateTo('/app/crm'); }}>CRM</a>
            </li>
            <li>
              <a href="/app/insurance" onClick={(e) => { e.preventDefault(); navigateTo('/app/insurance'); }}>Insurance</a>
            </li>
            <li>
              <a href="/app/management" onClick={(e) => { e.preventDefault(); navigateTo('/app/management'); }}>Management</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {renderContent()}
    </AuthContext.Provider>
  )
}

export default App
