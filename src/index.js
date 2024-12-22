import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Kök eleman oluşturma
const root = ReactDOM.createRoot(document.getElementById('root'));

// Uygulamayı render etme
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
