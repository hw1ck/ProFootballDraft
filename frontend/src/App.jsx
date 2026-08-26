import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Sandbox from './pages/Sandbox/Sandbox';
import BoardRoom from './pages/BoardRoom/BoardRoom';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/boardroom" element={<BoardRoom />} />
      </Routes>
    </div>
  )
}

export default App
