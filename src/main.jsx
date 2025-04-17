import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home'; // ✅ Make sure this matches your folder structure
import './index.css'; // optional, but keep if you have styling here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
