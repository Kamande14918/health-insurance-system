import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();

  // Check if the current path is the homepage route
  const isHomepage = location.pathname === '/';

  // If it's the homepage, return null to exclude the Navbar
  if (isHomepage) {
    return null;
  }

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/submit-claim">Submit Claim</Link></li>
        <li><Link to="/make-payment">Make Payment</Link></li>
        <li><Link to="/claim-history">Claim History</Link></li>
        <li><Link to="/payment-history">Payment History</Link></li>
        {/* <li><Link to="/reports">Reports</Link></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
