import  { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/claims', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setClaims(response.data);
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('Error fetching claims');
      }
    };

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Error fetching payments');
      }
    };

    fetchClaims();
    fetchPayments();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <div className="dashboard-section">
        <h3>Claims Status</h3>
        <ul>
          {claims.map((claim) => (
            <li key={claim.id}>{claim.claim_type}: {claim.claim_amount} - {claim.status}</li>
          ))}
        </ul>
      </div>
      <div className="dashboard-section">
        <h3>Payment History</h3>
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>{payment.amount} - {payment.status}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;