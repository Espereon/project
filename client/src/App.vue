<script setup></script>

<template>
  <div>
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-button">Создать конфиг чека</router-link>
        <router-link to="/gazprom" class="nav-button"
          >Ссылка на чеки газпрома</router-link
        >
        <router-link to="/updatesoft" class="nav-button"
          >Обновить ПО</router-link
        >
      </div>
    </nav>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #242424;
  border-bottom: 1px solid #444;
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
}

.nav-button {
  display: inline-block;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #0b63f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 180px;
  text-align: center;
}

.nav-button:hover {
  background-color: #3c82f8;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3c82f8;
  transform: translateY(-1px);
}

.nav-button.router-link-active {
  background-color: #1e40af;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #1e40af;
}

.content {
  margin-top: 100px;
  padding: 2rem;
}

@media (prefers-color-scheme: light) {
  .navbar {
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }

  .nav-button {
    background-color: #0b63f6;
  }

  .nav-button:hover {
    background-color: #3c82f8;
  }

  .nav-button.router-link-active {
    background-color: #1e40af;
  }
}
</style>
