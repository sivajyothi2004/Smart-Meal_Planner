import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getWeeklyMealPlan, createMealPlan, updateMealPlan, deleteMealPlan } from '../services/mealPlanService';
import { getAllMeals } from '../services/mealService';

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const mealTimes = ['BREAKFAST', 'LUNCH', 'DINNER'];

  useEffect(() => {
    fetchMealPlans();
    fetchMeals();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const data = await getWeeklyMealPlan();
      setMealPlans(data);
    } catch (err) {
      setError('Failed to fetch meal plans');
    }
  };

  const fetchMeals = async () => {
    try {
      const data = await getAllMeals();
      setMeals(data);
    } catch (err) {
      setError('Failed to fetch meals');
    }
  };

  const getMealForDayAndTime = (day, mealTime) => {
    const plan = mealPlans.find(p => p.day === day && p.mealTime === mealTime);
    return plan ? plan.meal : null;
  };

  const getPlanIdForDayAndTime = (day, mealTime) => {
    const plan = mealPlans.find(p => p.day === day && p.mealTime === mealTime);
    return plan ? plan.id : null;
  };

  const handleMealChange = async (day, mealTime, mealId) => {
    setError('');
    setSuccess('');

    if (!mealId) {
      const planId = getPlanIdForDayAndTime(day, mealTime);
      if (planId) {
        try {
          await deleteMealPlan(planId);
          setSuccess(`Meal removed from ${day} ${mealTime}`);
          fetchMealPlans();
        } catch (err) {
          setError('Failed to remove meal');
        }
      }
      return;
    }

    const existingPlanId = getPlanIdForDayAndTime(day, mealTime);

    try {
      if (existingPlanId) {
        await updateMealPlan(existingPlanId, { mealId: parseInt(mealId) });
        setSuccess(`Meal updated for ${day} ${mealTime}`);
      } else {
        await createMealPlan({ day, mealTime, mealId: parseInt(mealId) });
        setSuccess(`Meal assigned to ${day} ${mealTime}`);
      }
      fetchMealPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const getMealIcon = (mealTime) => {
    switch(mealTime) {
      case 'BREAKFAST': return '🌅';
      case 'LUNCH': return '☀️';
      case 'DINNER': return '🌙';
      default: return '🍽️';
    }
  };

  const getMealTypeIcon = (mealType) => {
    switch(mealType) {
      case 'BREAKFAST': return '🌅';
      case 'LUNCH': return '☀️';
      case 'DINNER': return '🌙';
      case 'SNACK': return '🍿';
      default: return '🍽️';
    }
  };

  return (
    <Layout>
      <div className="card">
        <div className="page-header">
          <h2>📅 Weekly Meal Planner</h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Day</th>
                <th style={{ width: '28%' }}>🌅 Breakfast</th>
                <th style={{ width: '28%' }}>☀️ Lunch</th>
                <th style={{ width: '28%' }}>🌙 Dinner</th>
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day) => (
                <tr key={day}>
                  <td>
                    <div className="day-planner">{day}</div>
                  </td>
                  {mealTimes.map((mealTime) => {
                    const assignedMeal = getMealForDayAndTime(day, mealTime);
                    return (
                      <td key={mealTime}>
                        <select
                          value={assignedMeal ? assignedMeal.id : ''}
                          onChange={(e) => handleMealChange(day, mealTime, e.target.value)}
                          className="meal-selector"
                        >
                          <option value="">{getMealIcon(mealTime)} Select meal</option>
                          {meals.map((meal) => (
                            <option key={meal.id} value={meal.id}>
                              {getMealTypeIcon(meal.mealType)} {meal.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9ff', borderRadius: '12px' }}>
          <h4 style={{ marginBottom: '10px' }}>💡 Tip</h4>
          <p style={{ color: '#666', marginBottom: '5px' }}>• You can assign ANY meal to ANY time slot - no restrictions!</p>
          <p style={{ color: '#666', marginBottom: '5px' }}>• Meal type icons (🌅🍿☀️🌙) are just suggestions for organizing</p>
          <p style={{ color: '#666' }}>• After planning, go to Grocery List to generate your shopping list</p>
        </div>
      </div>
    </Layout>
  );
};

export default MealPlanner;