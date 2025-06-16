import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axios";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { currentUser, setToken, setCurrentUser } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/logout');
      setToken(null);
      setCurrentUser({});
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-user"></i> {currentUser.nama_karyawan}
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-header">User Menu</span>
            <div className="dropdown-divider"></div>
            <NavLink to="/profile" className="dropdown-item">
              <i className="fas fa-user-circle mr-2"></i> User Profile
            </NavLink>
            <div className="dropdown-divider"></div>
            <a href="#" onClick={handleLogout} className="dropdown-item dropdown-footer bg-danger">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}