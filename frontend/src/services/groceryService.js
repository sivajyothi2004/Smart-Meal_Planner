import API from './api';

export const generateGroceryList = async () => {
    const response = await API.post('/grocery-list/generate');
    return response.data;
};

export const getGroceryList = async () => {
    const response = await API.get('/grocery-list');
    return response.data;
};

export const markAsBought = async (id, bought) => {
    const response = await API.put(`/grocery-list/${id}/bought`, { bought });
    return response.data;
};

export const clearGroceryList = async () => {
    const response = await API.delete('/grocery-list');
    return response.data;
};