import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ArcadeGameApp from './ArcadeGameApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArcadeGameApp />
  </StrictMode>
);
