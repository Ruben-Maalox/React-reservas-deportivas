import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import { ConsentBanner } from './components/ConsentBanner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="670850869047-ctj9q23rejpe18q69nlg1afjn28elbpu.apps.googleusercontent.com">
      <App />
      <ConsentBanner />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
