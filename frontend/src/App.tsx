import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PantallaTV from './pages/PantallaTV';
import PanelOperativo from './pages/PanelOperativo';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PantallaTV />} />
        <Route path="/panel" element={<PanelOperativo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
