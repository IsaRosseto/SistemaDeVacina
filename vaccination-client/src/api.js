import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5136/api';

const api = axios.create({
    baseURL: 'http://localhost:5136/api'
});

export const getPeople = () => api.get('/person');
export const createPerson = (person) => api.post('/person', person);
export const deletePerson = (id) => api.delete(`/person/${id}`);

export const getVaccines = () => api.get('/vaccine');
// Função extra para cadastrar vacinas iniciais via frontend se quiser (opcional)
export const createVaccine = (vaccine) => api.post('/vaccine', vaccine);

export const getCard = (personId) => api.get(`/vaccination/card/${personId}`);
export const registerVaccination = (data) => api.post('/vaccination', data);
export const deleteRecord = (id) => api.delete(`/vaccination/${id}`);

export default api;