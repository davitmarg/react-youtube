import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PlaylistPage from './playlist.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:videoId" element={<App />} />
        {/* <Route path="/playlist" element={<PlaylistPage />} /> */}
        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
