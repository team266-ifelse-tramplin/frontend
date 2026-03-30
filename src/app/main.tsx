import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './providers';
import App from './App.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
