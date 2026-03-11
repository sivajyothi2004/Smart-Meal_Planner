import API from './api';

export const createMealPlan = async (data) => {
    const response = await API.post('/meal-plans', data);
    return response.data;
};

export const getWeeklyMealPlan = async () => {
    const response = await API.get('/meal-plans');
    return response.data;
};

export const updateMealPlan = async (id, data) => {
    const response = await API.put(`/meal-plans/${id}`, data);
    return response.data;
};

export const deleteMealPlan = async (id) => {
    const response = await API.delete(`/meal-plans/${id}`);
    return response.data;
};