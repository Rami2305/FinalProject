import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interfaces para tipar las respuestas
interface AuthResponse {
    message: string;
    accessToken?: string;
    userId?: number;
    userEmail?: string;
}

export const authAPI = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post<AuthResponse>('/api/user/login', credentials);
        return {
            message: response.data.message,
            accessToken: response.data.accessToken,
            userId: response.data.userId,
            userEmail: response.data.userEmail
        };
    },
    
    register: async (credentials: { email: string; password: string }) => {
        const response = await api.post<AuthResponse>('/api/user/register', credentials);
        return {
            message: response.data.message,
            userId: response.data.userId,
            userEmail: response.data.userEmail
        };
    },
    
    logout: () => api.delete('/api/user/logout')
};


export default api;