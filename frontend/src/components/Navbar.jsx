import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/dashboard" className="navbar-brand">
            <span>🍽️</span>
            <span>Meal Planner</span>
          </Link>
          {user && (
            <div style={{ marginLeft: '40px' }}>
              <Link to="/ingredients">Ingredients</Link>
              <Link to="/meals">Meals</Link>
              <Link to="/meal-planner">Planner</Link>
              <Link to="/grocery-list">Grocery List</Link>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ marginRight: '20px' }}>👋 {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;