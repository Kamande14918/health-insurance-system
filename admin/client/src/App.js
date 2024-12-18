// admin/client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import AdminHome from './components/AdminHome';
import Reports from './components/reports/Reports';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<Reports />} />
          
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
