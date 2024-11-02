import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Exportar funciones específicas para diferentes tipos de llamadas
export const authAPI = {
    login: (credentials: { email: string; password: string }) => 
        api.post('/api/user/login', credentials),
    
    register: (credentials: { email: string; password: string }) => 
        api.post('/api/user/register', credentials),
    
    logout: () => 
        api.delete('/user/logout')
};

export const questionsAPI = {
    getQuestions: () => api.get('/api/questions'),
    // Añade aquí otras llamadas relacionadas con preguntas
};

export const leaderboardAPI = {
    getLeaderboard: () => api.get('/api/leaderboard'),
    // Añade aquí otras llamadas relacionadas con el leaderboard
};

export default api;