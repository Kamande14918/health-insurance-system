import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ClaimSubmissionForm from './components/claims/ClaimSubmissionForm';
import ClaimsList from './components/claims/ClaimsList';
import PaymentForm from './components/payments/PaymentForm';
import PaymentHistory from './components/payments/PaymentHistory';
import Dashboard from './components/Dashboard';
import Navbar from './components/shared/NavBar';
import PrivateRoute from './components/PrivateRoute';
 import Reports from './components/reports/Reports';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/submit-claim" element={<PrivateRoute element={ClaimSubmissionForm} />} />
          <Route path="/claim-history" element={<PrivateRoute element={ClaimsList} />} />
          <Route path="/make-payment" element={<PrivateRoute element={PaymentForm} />} />
          <Route path="/payment-history" element={<PrivateRoute element={PaymentHistory} />} />
          <Route path="/reports" element={<PrivateRoute element={Reports} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;