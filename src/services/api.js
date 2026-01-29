const API_URL = 'http://localhost:3000/api/reg';

export default {
    //РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
    async register(userData) {
        const response = await fetch(`${API_URL}/rererererer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    //ПОЛУЧЕНИЕ СПИСКА ПОЛЬЗОВАТЕЛЕЙ
    async getUsers() {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        return await response.json();
    }

};