<template>
  <div class="page-404">
    <div class="bg">
      <div class="orb orb--1"></div>
      <div class="orb orb--2"></div>
      <div class="orb orb--3"></div>
      <div class="grid"></div>
    </div>

    <div class="content">
      <div class="number-wrap">
        <span class="n4 n4--left">4</span>
        <div class="zero-wrap">
          <div class="zero">
            <div class="zero-inner">
              <div class="coin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M9 8h4.5a2.5 2.5 0 010 5H9m0 0h5a2.5 2.5 0 010 5H9" />
                </svg>
              </div>
            </div>
          </div>
          <div class="orbit orbit--1">
            <div class="planet planet--1">💳</div>
          </div>
          <div class="orbit orbit--2">
            <div class="planet planet--2">🏦</div>
          </div>
          <div class="orbit orbit--3">
            <div class="planet planet--3">📊</div>
          </div>
        </div>
        <span class="n4 n4--right">4</span>
      </div>

      <div class="text-block">
        <div class="badge">Error 404</div>
        <h1 class="title">¡Ups! Página no encontrada</h1>
        <p class="subtitle">
          Parece que esta ruta no existe en NexoFin.<br />
          Puede que haya sido movida o que la URL esté incorrecta.
        </p>
        <div class="actions">
          <router-link to="/" class="btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Volver al inicio
          </router-link>
          <router-link to="/dashboard" class="btn-outline">
            Ir al Dashboard
          </router-link>
        </div>
      </div>

      <div class="floating-cards">
        <div class="fcard fcard--1">
          <div class="fcard-icon">💰</div>
          <div class="fcard-text">
            <div class="fcard-label">Saldo</div>
            <div class="fcard-value">$0.00</div>
          </div>
        </div>
        <div class="fcard fcard--2">
          <div class="fcard-icon">📉</div>
          <div class="fcard-text">
            <div class="fcard-label">Esta ruta</div>
            <div class="fcard-value">No existe</div>
          </div>
        </div>
        <div class="fcard fcard--3">
          <div class="fcard-icon">🔍</div>
          <div class="fcard-text">
            <div class="fcard-label">Estado</div>
            <div class="fcard-value error">Error 404</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-404 {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

/* BG */
.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: drift 10s ease-in-out infinite alternate;
}

.orb--1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.18), transparent 70%);
  top: -150px;
  left: -150px;
  animation-duration: 12s;
}

.orb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(40, 167, 69, 0.15), transparent 70%);
  bottom: -100px;
  right: -100px;
  animation-duration: 9s;
  animation-delay: -3s;
}

.orb--3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 86, 255, 0.1), transparent 70%);
  top: 50%;
  left: 50%;
  animation-duration: 14s;
  animation-delay: -6s;
}

@keyframes drift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(25px, 20px) scale(1.06);
  }
}

.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 86, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 86, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* CONTENT */
.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 900px;
  width: 100%;
}

/* NUMBER */
.number-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.n4 {
  font-size: 9rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 3px #007BFF;
  animation: pulse4 3s ease-in-out infinite;
  line-height: 1;
}

.n4--left {
  animation-delay: 0s;
}

.n4--right {
  animation-delay: 0.4s;
}

@keyframes pulse4 {

  0%,
  100% {
    -webkit-text-stroke-color: #007BFF;
  }

  50% {
    -webkit-text-stroke-color: #28A745;
  }
}

.zero-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zero {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007BFF, #0041a8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 86, 255, 0.4), 0 0 0 8px rgba(0, 123, 255, 0.15);
  animation: rotate-zero 8s linear infinite;
}

.zero-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff, #f0fdf4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin {
  animation: counter-rotate 8s linear infinite;
}

.coin svg {
  width: 40px;
  height: 40px;
  color: #007BFF;
}

@keyframes rotate-zero {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes counter-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

/* ORBITS */
.orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(0, 123, 255, 0.25);
  animation: spin linear infinite;
}

.orbit--1 {
  width: 160px;
  height: 160px;
  animation-duration: 6s;
}

.orbit--2 {
  width: 200px;
  height: 200px;
  animation-duration: 10s;
  animation-direction: reverse;
}

.orbit--3 {
  width: 240px;
  height: 240px;
  animation-duration: 14s;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.planet {
  position: absolute;
  font-size: 1.1rem;
  animation: counter-spin linear infinite;
}

.planet--1 {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  animation-duration: 6s;
}

.planet--2 {
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  animation-duration: 10s;
}

.planet--3 {
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  animation-duration: 14s;
}

@keyframes counter-spin {
  from {
    transform: translateX(-50%) rotate(0deg);
  }

  to {
    transform: translateX(-50%) rotate(-360deg);
  }
}

/* TEXT */
.text-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.badge {
  display: inline-flex;
  background: rgba(0, 123, 255, 0.08);
  color: #007BFF;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 99px;
  border: 1px solid rgba(0, 123, 255, 0.2);
  letter-spacing: 0.05em;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  letter-spacing: -0.03em;
}

.subtitle {
  font-size: 1rem;
  color: #6C757D;
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #007BFF, #0056d6);
  color: #fff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.75rem;
  border-radius: 10px;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 18px rgba(0, 86, 255, 0.3);
  font-family: 'Inter', sans-serif;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 86, 255, 0.4);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  color: #007BFF;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.85rem 1.75rem;
  border-radius: 10px;
  border: 1.5px solid #007BFF;
  transition: background 0.15s, transform 0.15s;
  font-family: 'Inter', sans-serif;
}

.btn-outline:hover {
  background: #f0f7ff;
  transform: translateY(-2px);
}

/* FLOATING CARDS */
.floating-cards {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.fcard {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.fcard--1 {
  animation: float 4s ease-in-out infinite;
}

.fcard--2 {
  animation: float 4s ease-in-out infinite;
  animation-delay: -1.3s;
}

.fcard--3 {
  animation: float 4s ease-in-out infinite;
  animation-delay: -2.6s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.fcard-icon {
  font-size: 1.5rem;
}

.fcard-label {
  font-size: 0.7rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.fcard-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.fcard-value.error {
  color: #dc3545;
}

@media (max-width: 600px) {
  .n4 {
    font-size: 5rem;
  }

  .zero-wrap {
    width: 100px;
    height: 100px;
  }

  .zero {
    width: 90px;
    height: 90px;
  }

  .title {
    font-size: 1.5rem;
  }

  .floating-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>