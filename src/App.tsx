import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AgentView } from './views/AgentView';
import { ManagerView } from './views/ManagerView';
import { RoleSelection } from './components/RoleSelection';
import { Layout } from './components/Layout';
import { UpdaterCheck } from './components/UpdaterCheck';
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <UpdaterCheck />
      <Routes>
        <Route path="/" element={
          <div className="app-container center-content">
            <RoleSelection />
          </div>
        } />
        <Route path="/:teamId/agent" element={<Layout title="ระบบพนักงาน (Agent)"><AgentView /></Layout>} />
        <Route path="/:teamId/manager" element={<Layout title="ระบบจัดการ (Manager)"><ManagerView /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
