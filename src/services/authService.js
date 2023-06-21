import api from './api';

const login = async (loginData) => {
    try {
        const response = await api.post('/users/login', loginData);
        localStorage.setItem('jwt', response.data.jwt);
    } catch (error) {
        console.error('Error during login', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('jwt');
};

const register = async (registerData) => {
    try {
        const response = await api.post('/managers/register', registerData);
        localStorage.setItem('jwt', response.data.jwt.jwt);
        return response.data;
    } catch (error) {
        console.error('Error during registration', error);
        throw error;
    }
};

export {login, register};
