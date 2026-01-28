
const API_URL = 'http://localhost:3000/api';

export default {
    //РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(userData)
        });
        return await response.json();
    },

    //ПОЛУЧЕНИЕ СПИСКА ПОЛЬЗОВАТЕЛЕЙ
    async getUsers() {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET'
        });
        return await response.json();
      }
    
};