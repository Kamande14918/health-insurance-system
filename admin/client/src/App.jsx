import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Reports from './components/reports/Reports';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute component={AdminDashboard} />} />
        <Route path="/admin/report" element={<PrivateRoute component={Reports} />} />
      </Routes>
    </Router>
  );
}

export default App;