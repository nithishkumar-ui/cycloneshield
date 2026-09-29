import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './ui/TopBar';
import LandingPage from './app/LandingPage';
import CommandPage from './app/CommandPage';
import AssetsPage from './app/AssetsPage';
import AboutPage from './app/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TopBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/command/:scenarioId" element={<CommandPage />} />
          <Route path="/assets/:scenarioId" element={<AssetsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
