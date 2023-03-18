import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddNewEntry from './pages/AddNewEntry';
import Positions from './pages/Positions';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/add-new-entry" element={<AddNewEntry />} />
          <Route path="/positions" element={<Positions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
