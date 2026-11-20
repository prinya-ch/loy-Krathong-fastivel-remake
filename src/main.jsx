import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Purge any stale mock storage on startup
try {
  localStorage.removeItem('loy_krathong_fleet_v1');
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
