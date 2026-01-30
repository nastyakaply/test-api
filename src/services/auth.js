const API_URL = 'http://localhost:3000/api/auth';

export default {
    //авторизация 
    async auth(userData) {
        const response = await fetch(`${API_URL}/Valid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },


};