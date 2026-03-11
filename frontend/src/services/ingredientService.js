import API from './api';

export const createIngredient = async (data) => {
    const response = await API.post('/ingredients', data);
    return response.data;
};

export const getAllIngredients = async () => {
    const response = await API.get('/ingredients');
    return response.data;
};

export const updateIngredient = async (id, data) => {
    const response = await API.put(`/ingredients/${id}`, data);
    return response.data;
};

export const deleteIngredient = async (id) => {
    const response = await API.delete(`/ingredients/${id}`);
    return response.data;
};