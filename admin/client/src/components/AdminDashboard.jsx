import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Reports from './reports/Reports';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users, claims, and payment history
    const token = localStorage.getItem('adminToken');
    axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Users fetched:', response.data); // Add logging
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <strong>{user.name} - {user.email}</strong>
                <ul>
                  {user.claims && user.claims.map(claim => (
                    <li key={claim.id}>
                      Claim: {claim.claim_type} - {claim.claim_amount} - {claim.status}
                      <ul>
                        {claim.payments && claim.payments.map(payment => (
                          <li key={payment.id}>
                            Payment: {payment.amount} - {payment.status}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button onClick={() => document.getElementById('reporting-module').style.display = 'block'}>Generate Reports</button>
        </div>
      </div>
      <div id="reporting-module" style={{ display: 'none' }}>
        <Reports />
      </div>
    </div>
  );
};

export default AdminDashboard;