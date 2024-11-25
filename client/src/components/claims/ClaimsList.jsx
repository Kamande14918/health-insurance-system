import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './claims.css';

const ClaimsList = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      const fetchClaims = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/claims', {
            headers: {
              'Authorization': `Bearer ${token}`, // Include token in headers
            },
            withCredentials: true
          });
          setClaims(response.data);
        } catch (err) {
          console.error('Error fetching claims:', err);
          setError('Error fetching claims');
        }
      };

      fetchClaims();
    }
  }, [navigate]);

  return (
    <div className="claims-list">
      <h2>Your Claims</h2>
      {error && <p className="error">{error}</p>}
      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <ul>
          {claims.map((claim) => (
            <li key={claim.id}>
              <p>Type: {claim.claim_type}</p>
              <p>Amount: {claim.claim_amount}</p>
              <p>Description: {claim.description}</p>
              <p>Status: {claim.status}</p>
              <p>Created At: {new Date(claim.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClaimsList;