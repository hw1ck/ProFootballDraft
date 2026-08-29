import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Sandbox from './pages/Sandbox/Sandbox';
import BoardRoom from './pages/BoardRoom/BoardRoom';
import SessionManager from './pages/Session/SessionManager';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/boardroom" element={<BoardRoom />} />
        <Route path="/session/:modeId" element={<SessionManager />} />
      </Routes>
    </div>
  )
}

export default App
