import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGrid from './components/ImageGrid';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="brand">Oculoop</div>
        </nav>

        <Routes>
          <Route path="/" element={<ImageGrid />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
