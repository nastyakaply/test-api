<template>
  <div class="simple-registration">
    <h1>Регистрация</h1>
    
    <!-- Форма -->
    <form @submit.prevent="registerUser">
      <div class="input-group">
        <label>Имя:</label>
        <input v-model="name" type="text">
      </div>
      
      <div class="input-group">
        <label>Email:</label>
        <input v-model="email" type="email" required>
      </div>
      
      <div class="input-group">
        <label>Пароль:</label>
        <input v-model="password" type="password" required>
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Отправляем...' : 'Зарегистрироваться' }}
      </button>
    </form>
    
    <!-- Результат -->
    <div v-if="message" class="result" :class="resultType">
      {{ message }}
    </div>
    
    <!-- Ссылка назад -->
    <router-link to="/" class="back-link">← На главную</router-link>
  </div>
</template>

<script>
import api from '@/services/api.js';

export default {
  name: 'SimpleRegistration',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      loading: false,
      message: '',
      resultType: '' // 'success' или 'error'
    }
  },
  methods: {
    async registerUser() {
      this.loading = true;
      this.message = '';
      
      try {
        // 1. Собираем данные
        const userData = {
          name: this.name,
          email: this.email,
          password: this.password
        };
        
        console.log('Отправляю данные:', userData);
        
        // 2. Используем api.js для отправки
        const result = await api.register(userData);
        
        console.log('Ответ от сервера:', result);
        
        // 3. Показываем результат
        if (result.success) {
          this.message = result.message;
          this.resultType = 'success';
          this.name = '';
          this.email = '';
          this.password = '';
        } else {
          this.message = result.message;
          this.resultType = 'error';
        }
        
      } catch (error) {
        console.error('Ошибка:', error);
        this.message = 'Ошибка соединения с сервером';
        this.resultType = 'error';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

