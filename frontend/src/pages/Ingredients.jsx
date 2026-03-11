import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } from '../services/ingredientService';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, []);

  
  const fetchIngredients = async () => {
  console.log('Token:', localStorage.getItem('token'));
  try {
    const data = await getAllIngredients();
    setIngredients(data);
  } catch (err) {
    console.error('Error details:', err.response);
    setError('Failed to fetch ingredients');
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editMode) {
        await updateIngredient(currentIngredient.id, formData);
        setSuccess('Ingredient updated successfully');
      } else {
        await createIngredient(formData);
        setSuccess('Ingredient added successfully');
      }
      fetchIngredients();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (ingredient) => {
    setEditMode(true);
    setCurrentIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await deleteIngredient(id);
        setSuccess('Ingredient deleted successfully');
        fetchIngredients();
      } catch (err) {
        setError('Failed to delete ingredient');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', quantity: '', unit: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentIngredient(null);
  };

  return (
    <Layout>
      <div className="card">
        <div className="page-header">
            <h2>📦 Ingredients</h2>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                ➕ Add Ingredient
            </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.unit}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEdit(ingredient)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(ingredient.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ingredients.length === 0 && (
            <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <p>No ingredients found. Add your first ingredient!</p>
            </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={resetForm}>&times;</button>
            <h3>{editMode ? 'Edit Ingredient' : 'Add Ingredient'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} required>
                  <option value="">Select Unit</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="cup">Cup</option>
                  <option value="tbsp">Tablespoon</option>
                  <option value="tsp">Teaspoon</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                {editMode ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Ingredients;