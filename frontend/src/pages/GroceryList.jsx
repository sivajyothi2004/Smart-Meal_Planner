import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { generateGroceryList, getGroceryList, markAsBought, clearGroceryList } from '../services/groceryService';

const GroceryList = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const fetchGroceryList = async () => {
    try {
      const data = await getGroceryList();
      setGroceryItems(data);
    } catch (err) {
      setError('Failed to fetch grocery list');
    }
  };

  const handleGenerate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await generateGroceryList();
      setSuccess('Grocery list generated successfully!');
      fetchGroceryList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate grocery list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBought = async (id, currentStatus) => {
    try {
      await markAsBought(id, !currentStatus);
      fetchGroceryList();
    } catch (err) {
      setError('Failed to update item status');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear the grocery list?')) {
      try {
        await clearGroceryList();
        setSuccess('Grocery list cleared');
        fetchGroceryList();
      } catch (err) {
        setError('Failed to clear grocery list');
      }
    }
  };

  const completedCount = groceryItems.filter(item => item.bought).length;
  const totalCount = groceryItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Layout>
      <div className="card">
        <div className="page-header">
            <h2>🛒 Grocery List</h2>
            <div>
                <button
                className="btn btn-success"
                onClick={handleGenerate}
                disabled={loading}
                style={{ marginRight: '10px' }}
                >
                {loading ? '⏳ Generating...' : '✨ Generate List'}
                </button>
                <button className="btn btn-danger" onClick={handleClear}>
                🗑️ Clear List
                </button>
            </div>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {totalCount > 0 && (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
            <span>🛒 Shopping Progress</span>
            <span>{completedCount} / {totalCount} items</span>
            </div>
            <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                {progress > 10 && `${Math.round(progress)}%`}
            </div>
            </div>
        </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {groceryItems.map((item) => (
              <tr key={item.id} style={{ textDecoration: item.bought ? 'line-through' : 'none' }}>
                <td>
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => handleToggleBought(item.id, item.bought)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.totalQuantity}</td>
                <td>{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {groceryItems.length === 0 && (
            <div className="empty-state">
                <div className="empty-state-icon">🛒</div>
                <p>No items in grocery list. Generate a list from your weekly meal plan!</p>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default GroceryList;