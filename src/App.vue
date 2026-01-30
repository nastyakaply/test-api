<template>
  <div class="app-header">
    <header class="header-home">
      РЕГистРАШКА.VUE
    </header>
    <nav class="nav-home">
      <router-link class="nav-link" to="/">Типа ГлаВнаЯ</router-link>
      <router-link class="nav-link" to="/register">ЗарегаЙся, БРО</router-link>
      <router-link class="nav-link" to="/auth">Войди если хош</router-link>
    </nav>
  </div>

  <main>
    <router-view/>
  </main>

  <footer class="app-footer">
    <div class="footer-content">
        <div class="footer-links">
          <a href="http://localhost:3000" target="_blank" class="footer-link">
            API: localhost:3000
          </a>
          <span class="footer-separator">•</span>
          <a href="http://localhost:8080" class="footer-link">
            Frontend: localhost:8080
          </a>
        </div>
        <p class="footer-copyright">
          © 2026 Vue Registration App | 
          <span class="fun-text">Без JS никак ^_^</span>
        </p>
      </div>
  </footer>
  
</template>

