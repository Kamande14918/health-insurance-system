import { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    nationalId: '',
    email: '',
    biometricData: '',
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', { ...user, password }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nationalId">National ID</label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={user.nationalId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="biometricData">Biometric Data</label>
          <input
            type="text"
            id="biometricData"
            name="biometricData"
            value={user.biometricData}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;