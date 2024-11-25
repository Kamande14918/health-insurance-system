import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles
import './styles.css'; // Import the new styles

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);