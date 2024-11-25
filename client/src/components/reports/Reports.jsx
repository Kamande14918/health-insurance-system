import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports', {
        params: { startDate, endDate, userId },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Error fetching reports');
    }
  }, [startDate, endDate, userId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const downloadCSV = () => {
    const csvRows = [
      ['ID', 'User ID', 'Claim Type', 'Claim Amount', 'Status', 'Created At'],
      ...reports.map(report => [
        report.id,
        report.user_id,
        report.claim_type,
        report.claim_amount,
        report.status,
        report.created_at,
      ]),
    ];

    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'User ID', 'Claim Type', 'Claim Amount', 'Status', 'Created At']],
      body: reports.map(report => [
        report.id,
        report.user_id,
        report.claim_type,
        report.claim_amount,
        report.status,
        report.created_at,
      ]),
    });
    doc.save('reports.pdf');
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleFilterSubmit}>
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
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <button type="submit">Filter</button>
      </form>
      {reports.length > 0 && (
        <>
          <button onClick={downloadCSV}>Download CSV</button>
          <button onClick={downloadPDF}>Download PDF</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Claim Type</th>
                <th>Claim Amount</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.user_id}</td>
                  <td>{report.claim_type}</td>
                  <td>{report.claim_amount}</td>
                  <td>{report.status}</td>
                  <td>{report.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Reports;