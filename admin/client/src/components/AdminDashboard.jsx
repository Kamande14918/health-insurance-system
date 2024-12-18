import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersWithClaimsAndPayments = async () => {
      try {
        const token = localStorage.getItem('adminToken'); // Assuming the token is stored in localStorage
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('/api/admin/users-with-claims-and-payments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users with claims and payments:', err);
        if (err.response && err.response.status === 401) {
          setError('Token expired. Please log in again.');
          localStorage.removeItem('adminToken');
          navigate('/admin/login'); // Redirect to AdminLogin
        } else {
          setError('Error fetching users with claims and payments');
        }
      }
    };

    fetchUsersWithClaimsAndPayments();
  }, [navigate]);

  const handleUpdateClaimStatus = async (claimId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken'); // Assuming the token is stored in localStorage
      await axios.put(`/api/admin/claims/status/${claimId}`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the user data after updating the claim status
      const response = await axios.get('/api/admin/users-with-claims-and-payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error updating claim status:', err);
      setError('Error updating claim status');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {users.map(user => (
        <div key={user.national_id} className="user-section">
          <h3>{user.username} ({user.email})</h3>
          <h4>Claims</h4>
          <table>
            <thead>
              <tr>
                <th>Claim Type</th>
                <th>Claim Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {user.claims.map(claim => (
                <tr key={claim.claim_id}>
                  <td>{claim.claim_type}</td>
                  <td>{claim.claim_amount}</td>
                  <td>{claim.description}</td>
                  <td>{claim.claim_status}</td>
                  <td>
                    <select
                      value={claim.claim_status}
                      onChange={(e) => handleUpdateClaimStatus(claim.claim_id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Payments</h4>
          {user.payments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Payment Date</th>
                  <th>Payment Phone</th>
                  <th>Payment Amount</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {user.payments.map(payment => (
                  <tr key={payment.payment_id}>
                    <td>{new Date(payment.payment_created_at).toLocaleString()}</td>
                    <td>{payment.payment_phone}</td>
                    <td>{payment.payment_amount}</td>
                    <td>{payment.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment history yet for {user.username}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;