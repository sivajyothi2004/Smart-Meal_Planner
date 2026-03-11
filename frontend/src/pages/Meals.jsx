import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getAllMeals, createMeal, updateMeal, deleteMeal, getMealById } from '../services/mealService';
import { getAllIngredients } from '../services/ingredientService';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('LUNCH');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchMeals();
    fetchIngredients();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const data = await getAllMeals();
      console.log('Meals data received:', data);
      
      if (Array.isArray(data)) {
        setMeals(data);
      } else {
        console.error('Meals data is not an array:', data);
        setMeals([]);
        setError('Failed to load meals properly');
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to fetch meals');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const data = await getAllIngredients();
      console.log('Ingredients data received:', data);
      
      if (Array.isArray(data)) {
        setIngredients(data);
      } else {
        console.error('Ingredients data is not an array:', data);
        setIngredients([]);
      }
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('Failed to fetch ingredients');
      setIngredients([]);
    }
  };

  const openCreateModal = () => {
    setShowModal(true);
    setEditMode(false);
    setMealName('');
    setMealType('LUNCH');
    setSelectedIngredients([{ ingredientId: '', quantity: '', unit: '' }]);
    setError('');
    setSuccess('');
  };

  const addIngredientRow = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: '', unit: '' }]);
  };

  const removeIngredientRow = (index) => {
    const updated = selectedIngredients.filter((_, i) => i !== index);
    setSelectedIngredients(updated);
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...selectedIngredients];
    updated[index][field] = value;
    setSelectedIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    const validIngredients = selectedIngredients.filter(
      ing => ing.ingredientId && ing.quantity && ing.unit
    );

    if (validIngredients.length === 0) {
      setError('Please complete at least one ingredient');
      return;
    }

    const payload = {
      name: mealName,
      mealType: mealType,
      ingredients: validIngredients
    };

    try {
      if (editMode) {
        await updateMeal(currentMeal.id, payload);
        setSuccess('Meal updated successfully');
      } else {
        await createMeal(payload);
        setSuccess('Meal created successfully');
      }
      fetchMeals();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = async (meal) => {
    try {
      const fullMeal = await getMealById(meal.id);
      setEditMode(true);
      setCurrentMeal(fullMeal);
      setMealName(fullMeal.name);
      setMealType(fullMeal.mealType || 'LUNCH');
      
      const mealIngredients = fullMeal.mealIngredients?.map(mi => ({
        ingredientId: mi.ingredient.id,
        quantity: mi.quantity,
        unit: mi.unit
      })) || [];
      
      setSelectedIngredients(mealIngredients.length > 0 ? mealIngredients : [{ ingredientId: '', quantity: '', unit: '' }]);
      setShowModal(true);
      setError('');
      setSuccess('');
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to load meal details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(id);
        setSuccess('Meal deleted successfully');
        fetchMeals();
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete meal');
      }
    }
  };

  const resetForm = () => {
    setMealName('');
    setMealType('LUNCH');
    setSelectedIngredients([]);
    setShowModal(false);
    setEditMode(false);
    setCurrentMeal(null);
  };

  const filteredMeals = filterType === 'ALL' 
    ? meals 
    : meals.filter(meal => meal.mealType === filterType);

  if (loading) {
    return (
      <Layout>
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading meals...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card">
        <div className="page-header">
          <h2>🍳 Meals</h2>
          <button className="btn btn-primary" onClick={openCreateModal}>
            ➕ Create Meal
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn"
            onClick={() => setFilterType('ALL')}
            style={{ 
              background: filterType === 'ALL' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0', 
              color: filterType === 'ALL' ? 'white' : '#333' 
            }}
          >
            All
          </button>
          <button 
            className="btn"
            onClick={() => setFilterType('BREAKFAST')}
            style={{ 
              background: filterType === 'BREAKFAST' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0', 
              color: filterType === 'BREAKFAST' ? 'white' : '#333' 
            }}
          >
            🌅 Breakfast
          </button>
          <button 
            className="btn"
            onClick={() => setFilterType('LUNCH')}
            style={{ 
              background: filterType === 'LUNCH' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0', 
              color: filterType === 'LUNCH' ? 'white' : '#333' 
            }}
          >
            ☀️ Lunch
          </button>
          <button 
            className="btn"
            onClick={() => setFilterType('DINNER')}
            style={{ 
              background: filterType === 'DINNER' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0', 
              color: filterType === 'DINNER' ? 'white' : '#333' 
            }}
          >
            🌙 Dinner
          </button>
          <button 
            className="btn"
            onClick={() => setFilterType('SNACK')}
            style={{ 
              background: filterType === 'SNACK' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0', 
              color: filterType === 'SNACK' ? 'white' : '#333' 
            }}
          >
            🍿 Snack
          </button>
        </div>

        {Array.isArray(filteredMeals) && filteredMeals.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Meal Name</th>
                <th>Type</th>
                <th>Ingredients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map((meal) => (
                <tr key={meal.id}>
                  <td>{meal.name}</td>
                  <td>
                    <span className="ingredient-badge">
                      {meal.mealType === 'BREAKFAST' && '🌅 Breakfast'}
                      {meal.mealType === 'LUNCH' && '☀️ Lunch'}
                      {meal.mealType === 'DINNER' && '🌙 Dinner'}
                      {meal.mealType === 'SNACK' && '🍿 Snack'}
                    </span>
                  </td>
                  <td>
                    {meal.mealIngredients?.map((mi, idx) => (
                      <div key={idx} className="ingredient-badge">
                        {mi.ingredient.name} ({mi.quantity} {mi.unit})
                      </div>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: '10px' }}
                      onClick={() => handleEdit(meal)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(meal.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍳</div>
            <p>No meals found. Create your first meal!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => {
          if (e.target.className === 'modal') resetForm();
        }}>
          <div className="modal-content">
            <button className="close-btn" onClick={resetForm}>&times;</button>
            <h3>{editMode ? 'Edit Meal' : 'Create Meal'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Meal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Scrambled Eggs"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  required
                >
                  <option value="BREAKFAST">🌅 Breakfast</option>
                  <option value="LUNCH">☀️ Lunch</option>
                  <option value="DINNER">🌙 Dinner</option>
                  <option value="SNACK">🍿 Snack</option>
                </select>
              </div>

              <h4 style={{ marginTop: '20px', marginBottom: '15px' }}>Ingredients</h4>
              
              {ingredients.length === 0 ? (
                <div className="error" style={{ marginBottom: '15px' }}>
                  No ingredients available. Please add ingredients first!
                </div>
              ) : (
                <>
                  {selectedIngredients.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <select
                        value={item.ingredientId}
                        onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                        required
                        style={{ flex: 2 }}
                      >
                        <option value="">Select Ingredient</option>
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        required
                        style={{ flex: 1 }}
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        required
                        style={{ flex: 1 }}
                      >
                        <option value="">Unit</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="cup">cup</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="piece">piece</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeIngredientRow(index)}
                        disabled={selectedIngredients.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addIngredientRow}
                    style={{ marginBottom: '15px', width: '100%' }}
                  >
                    ➕ Add Another Ingredient
                  </button>
                </>
              )}

              <button 
                type="submit" 
                className="btn btn-success" 
                style={{ width: '100%' }}
                disabled={ingredients.length === 0}
              >
                {editMode ? 'Update Meal' : 'Create Meal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Meals;