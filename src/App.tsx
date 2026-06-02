import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AgentView } from './views/AgentView';
import { ManagerView } from './views/ManagerView';
import { LogOut } from 'lucide-react';
import './App.css'; // Removed old tauri styles, relying on index.css mostly

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection glass-panel animate-fade-in">
      <h2>Select Your Role</h2>
      <p className="text-muted">Welcome to Telesales Helpdesk</p>
      
      <div className="role-buttons">
        <button className="btn-primary" onClick={() => navigate('/agent')}>
          I am a Sales Agent
        </button>
        <button className="btn-secondary" onClick={() => navigate('/manager')}>
          I am a Manager
        </button>
      </div>
    </div>
  );
}

function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <h1>{title}</h1>
        <button className="btn-icon" onClick={() => navigate('/')} title="Logout/Switch Role">
          <LogOut size={20} />
        </button>
      </header>
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app-container center-content">
            <RoleSelection />
          </div>
        } />
        <Route path="/agent" element={<Layout title="Agent Dashboard"><AgentView /></Layout>} />
        <Route path="/manager" element={<Layout title="Manager Dashboard"><ManagerView /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
