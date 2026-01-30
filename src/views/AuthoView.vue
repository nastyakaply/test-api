<template>
  <div class="simple-avtorization">
    <h1>Авторизация</h1>
    
    <!-- Форма -->
    <form @submit.prevent="authUsers">
      <div class="input-group">
        <label>Email:</label>
        <input v-model="email" type="email" required>
      </div>
      
      <div class="input-group">
        <label>Пароль:</label>
        <input v-model="password" type="password" required>
      </div>
      
      <button type="submit" :disabled="loading">
      </button>
    </form>

     <!-- Результат -->
    <div v-if="message" class="result" :class="resultType">
      {{ message }}
    </div>
    
  </div>
</template>

<!--нужны скрипты -->
<script>
import auth from '@/services/auth';

export default {
    name: 'simpleAvtorization',
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            resultType: '',
            message: ''
        }
    },
    methods : {
        async authUsers() {
            this.loading = true;
            this.message = '';

            try {
                
                // 1. Собираем данные
                const userData = {
                email: this.email,
                password: this.password
                };

                 console.log('Отправляю данные:', userData);
        
                // 2. Используем auth.js для отправки
                const result = await auth.auth(userData);
                
                console.log('Ответ от сервера:', result);

                // 3. Показываем результат
                if (result.success) {
                    this.message = result.message;
                    this.resultType = 'success';
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