import axios from 'axios';
import { useState } from 'react';
import './ClaimSubmissionForm.css'; // Import the CSS file

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

      const response = await axios.post('http://localhost:5000/api/claims/submit-claim', formData, {
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
      <form className="claim-form" onSubmit={handleSubmit}>
        <h2>Submit a Claim</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="claimType">Claim Type</label>
          <input
            type="text"
            id="claimType"
            name="claimType"
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            placeholder="Claim Type"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="claimAmount">Claim Amount</label>
          <input
            type="number"
            id="claimAmount"
            name="claimAmount"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="Claim Amount"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="documents">Documents</label>
          <input
            type="file"
            id="documents"
            name="documents"
            onChange={handleFileChange}
            multiple
          />
        </div>
        <button type="submit" disabled={isLoading}>Submit Claim</button>
      </form>
    </div>
  );
};

export default ClaimSubmissionForm;
