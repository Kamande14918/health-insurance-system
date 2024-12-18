import  { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import PaymentHistory from './payments/PaymentHistory';

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const user_id = localStorage.getItem('user_id');

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

    fetchClaims();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div className="dashboard-section">
        <h3>Claims Status</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.claim_type}</td>
                <td>{claim.claim_amount}</td>
                <td>{claim.description}</td>
                <td>{claim.status}</td>
                <td>{new Date(claim.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user_id ? (
        <PaymentHistory user_id={user_id} />
      ) : (
        <p>Please log in to view your payment history.</p>
      )}
    </div>
  );
};

export default Dashboard;