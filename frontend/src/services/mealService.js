import API from './api';

export const createMeal = async (data) => {
    const response = await API.post('/meals', data);
    return response.data;
};

export const getAllMeals = async () => {
    const response = await API.get('/meals');
    return response.data;
};

export const getMealById = async (id) => {
    const response = await API.get(`/meals/${id}`);
    return response.data;
};

export const updateMeal = async (id, data) => {
    const response = await API.put(`/meals/${id}`, data);
    return response.data;
};

export const deleteMeal = async (id) => {
    const response = await API.delete(`/meals/${id}`);
    return response.data;
};