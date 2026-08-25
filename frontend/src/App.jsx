import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Sandbox from './pages/Sandbox/Sandbox';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </div>
  )
}

export default App
