import React, { useState } from 'react';
import axios from 'axios';
import './reports.css';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');

  const generateReport = (format) => {
    axios.get(`http://localhost:5000/api/reports?startDate=${startDate}&endDate=${endDate}&nationalId=${nationalId}&format=${format}`, {
      responseType: 'blob' // Important for handling binary data
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `user_report.${format}`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error generating report:', error);
        setError('Error generating report');
      });
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); generateReport('pdf'); }}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nationalId">National ID</label>
          <input
            type="text"
            id="nationalId"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
        </div>
        <button type="submit">Generate PDF Report</button>
        <button type="button" onClick={() => generateReport('csv')}>Generate CSV Report</button>
      </form>
    </div>
  );
};

export default Reports;