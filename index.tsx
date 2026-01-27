
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Vercel/Vite muhitida brauzerda xatolik bo'lmasligi uchun shim
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
