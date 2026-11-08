import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import './web.css';
import { Shell } from './Shell';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Shell />
  </StrictMode>,
);

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
