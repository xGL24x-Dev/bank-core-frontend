<template>
  <div class="not-found">
    <div class="bg-curves" aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <path d="M-80 380 Q200 150 500 320 Q750 480 1000 280 Q1150 180 1300 260" stroke="#e07b20" stroke-width="38" fill="none" stroke-linecap="round" opacity=".4"/>
        <path d="M900 -40 Q980 120 880 250 Q820 340 900 440" stroke="#8bc34a" stroke-width="32" fill="none" stroke-linecap="round" opacity=".4"/>
      </svg>
    </div>
    <div class="content">
      <p class="code">404</p>
      <h1>Página no encontrada</h1>
      <p class="sub">La ruta que buscas no existe.</p>
      <router-link to="/dashboard" class="btn">Volver al inicio</router-link>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap');
.not-found { font-family: 'Nunito', sans-serif; min-height: 100vh; background: #1e1e1e; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.bg-curves { position: absolute; inset: 0; pointer-events: none; }
.bg-curves svg { width: 100%; height: 100%; }
.content { position: relative; z-index: 2; text-align: center; }
.code { font-size: 96px; font-weight: 600; color: #f5a623; line-height: 1; margin-bottom: 12px; }
h1 { color: #fff; font-size: 24px; font-weight: 500; margin-bottom: 8px; }
.sub { color: #888; font-size: 15px; margin-bottom: 28px; }
.btn { display: inline-block; background: #f5a623; color: #1a1000; padding: 12px 28px; border-radius: 99px; font-size: 15px; font-weight: 600; text-decoration: none; }
.btn:hover { background: #e09a1a; }
</style>