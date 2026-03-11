import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p style={{ fontSize: '18px', color: '#fff' }}>Let's plan some delicious meals</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>🚀 Getting Started</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Follow these simple steps to organize your weekly meals and shopping
        </p>
        
        <div className="quick-start">
          <h3>Quick Start Guide</h3>
          <ol>
            <li>📦 Add ingredients to your pantry</li>
            <li>🍳 Create meals using those ingredients</li>
            <li>📅 Plan your week by assigning meals to days</li>
            <li>🛒 Generate your grocery shopping list</li>
          </ol>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '48px', marginBottom: '10px' }}>📦</h3>
          <h4>Ingredients</h4>
          <p style={{ opacity: '0.9' }}>Manage your pantry items</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '48px', marginBottom: '10px' }}>🍳</h3>
          <h4>Meals</h4>
          <p style={{ opacity: '0.9' }}>Create delicious recipes</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '48px', marginBottom: '10px' }}>📅</h3>
          <h4>Planner</h4>
          <p style={{ opacity: '0.9' }}>Schedule your week</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</h3>
          <h4>Grocery List</h4>
          <p style={{ opacity: '0.9' }}>Smart shopping list</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;