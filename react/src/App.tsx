import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', border: '2px solid #61dafb', borderRadius: '8px' }}>
      <h1 style={{ color: '#61dafb' }}>React Microfrontend</h1>
      <p>This is the React application running within the single-spa shell.</p>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Local State Count: {count}
        </button>
      </div>
      <p className="read-the-docs">
        Built with Vite + React + single-spa
      </p>
    </div>
  )
}

export default App
