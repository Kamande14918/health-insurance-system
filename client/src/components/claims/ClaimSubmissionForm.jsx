import { useState } from 'react';
import axios from 'axios';
import './claims.css';

const ClaimSubmissionForm = () => {
  const [claimType, setClaimType] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('claimType', claimType);
    formData.append('claimAmount', claimAmount);
    formData.append('description', description);
    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Form Data:', {
        claimType,
        claimAmount,
        description,
        documents: [...documents],
      });

      const response = await axios.post('http://localhost:5000/api/claims', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMessage('Claim submitted successfully');
      setError('');
      console.log('Response:', response);
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError('Error submitting claim');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="claim-submission-form">
        <h2>Submit a Claim</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="claimType">Claim Type</label>
            <input
              type="text"
              id="claimType"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="claimAmount">Claim Amount</label>
            <input
              type="number"
              id="claimAmount"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="documents">Upload Documents</label>
            <input
              type="file"
              id="documents"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading}>Submit Claim</button>
        </form>
      </div>
    </div>
  );
};

export default ClaimSubmissionForm;

// Server-side code removed from client-side component
