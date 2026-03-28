<template>
  <div class="page">

    <header class="topbar">
      <img src="@/assets/nexofin_logo.png" alt="NexoFin" class="topbar-logo" />
    </header>

    <main class="main">
      <div class="bg-orb bg-orb--1"></div>
      <div class="bg-orb bg-orb--2"></div>
      <div class="bg-orb bg-orb--3"></div>
      <div class="bg-lines"></div>

      <div class="card">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h1 class="title">Bienvenido</h1>
        <p class="subtitle">Ingresa a tu cuenta NexoFin</p>

        <Transition name="fade">
          <div v-if="authStore.error" class="alert">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
            {{ authStore.error }}
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" novalidate>

          <div class="field" :class="{ 'field--error': errors.email }">
            <label class="label">Correo electrónico</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <input v-model="form.email" type="email" class="input" placeholder="correo@ejemplo.com"
                autocomplete="email" @input="errors.email = ''; authStore.clearError()" />
            </div>
            <span v-if="errors.email" class="field-msg">{{ errors.email }}</span>
          </div>

          <div class="field" :class="{ 'field--error': errors.password }">
            <div class="label-row">
              <label class="label">Contraseña</label>
              <a href="#" class="link-sm">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <input v-model="form.password" :type="show ? 'text' : 'password'" class="input"
                placeholder="••••••••" autocomplete="current-password"
                @input="errors.password = ''; authStore.clearError()" />
              <button type="button" class="eye" @click="show = !show" tabindex="-1">
                <svg v-if="!show" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-msg">{{ errors.password }}</span>
          </div>

          <label class="check-row">
            <input v-model="form.remember" type="checkbox" class="check-input" />
            <span class="check-box"></span>
            <span class="check-text">Mantener sesión iniciada</span>
          </label>

          <button type="submit" class="btn-primary" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner"></span>
            <template v-else>
              <svg viewBox="0 0 20 20" fill="currentColor" style="width:17px;height:17px">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Iniciar sesión
            </template>
          </button>

        </form>

        <div class="divider"><span>¿Nuevo en NexoFin?</span></div>
        <router-link to="/register" class="btn-secondary">Crear una cuenta gratis</router-link>
      </div>
    </main>

    <footer class="footer">
      <span>© 2025 NexoFin S.A.</span>
    </footer>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router    = useRouter()
const authStore = useAuthStore()
const show      = ref(false)

const form   = reactive({ email: '', password: '', remember: false })
const errors = reactive({ email: '', password: '' })

function validate() {
  errors.email = ''; errors.password = ''
  let ok = true
  if (!form.email) { errors.email = 'El correo es requerido'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Correo inválido'; ok = false }
  if (!form.password) { errors.password = 'La contraseña es requerida'; ok = false }
  return ok
}

async function handleLogin() {
  if (!validate()) return
  await authStore.login({ email: form.email, password: form.password })
  if (!authStore.error) router.push('/dashboard')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── PAGE ───────────────────────────────────────────── */
.page {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  overflow: hidden;
  background: #f0f4ff;
  display: flex;
  flex-direction: column;
  color: #212529;
}

/* ── TOPBAR ─────────────────────────────────────────── */
.topbar {
  padding: 0.85rem 2rem;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,123,255,0.1);
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.topbar-logo { height: 45px; width: auto; display: block; }

/* ── MAIN ───────────────────────────────────────────── */
.main {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%);
}

/* ── FONDO ──────────────────────────────────────────── */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(70px);
  animation: drift 12s ease-in-out infinite alternate;
}
.bg-orb--1 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(0,123,255,0.18), transparent 70%); top: -180px; left: -180px; animation-duration: 14s; }
.bg-orb--2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(40,167,69,0.15), transparent 70%); bottom: -150px; right: -120px; animation-duration: 10s; animation-delay: -4s; }
.bg-orb--3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,86,255,0.1), transparent 70%); top: 40%; left: 60%; animation-duration: 16s; animation-delay: -8s; }
@keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,20px) scale(1.05); } }
.bg-lines { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(0,86,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,255,0.035) 1px, transparent 1px); background-size: 48px 48px; }

/* ── CARD ───────────────────────────────────────────── */
.card {
  position: relative;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 22px;
  padding: 2rem 2.5rem 1.75rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 0 0 1px rgba(0,123,255,0.07), 0 8px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,86,255,0.08);
  animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 3px;
  background: linear-gradient(90deg, #007BFF, #28A745);
  border-radius: 0 0 4px 4px;
}

.card-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #dbeafe, #bbf7d0); border-radius: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; border: 1px solid rgba(0,123,255,0.12); }

.title { font-size: 1.75rem; font-weight: 800; color: #1a202c; margin-bottom: 0.25rem; letter-spacing: -0.035em; text-align: center; }
.subtitle { font-size: 0.875rem; color: #6C757D; margin-bottom: 1.5rem; text-align: center; }
/* ── ALERT ──────────────────────────────────────────── */
.alert { display: flex; align-items: center; gap: 0.5rem; background: #fff5f5; border: 1px solid #fcc; color: #c0392b; border-radius: 10px; padding: 0.7rem 0.9rem; font-size: 0.83rem; margin-bottom: 1.2rem; }
.alert svg { width: 15px; height: 15px; flex-shrink: 0; }

/* ── FIELDS ─────────────────────────────────────────── */
.field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
.label-row { display: flex; align-items: center; justify-content: space-between; }
.label { font-size: 0.8rem; font-weight: 600; color: #374151; letter-spacing: 0.01em; }
.link-sm { font-size: 0.78rem; color: #007BFF; text-decoration: none; }
.link-sm:hover { text-decoration: underline; }

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 0.9rem; width: 15px; height: 15px; color: #9ca3af; pointer-events: none; }
.input { width: 100%; padding: 0.78rem 0.9rem 0.78rem 2.55rem; border: 1.5px solid #e5e7eb; border-radius: 11px; font-size: 0.9rem; font-family: inherit; color: #1a202c; background: #f9fafb; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; }
.input::placeholder { color: #b0b8c4; }
.input:focus { border-color: #007BFF; background: #fff; box-shadow: 0 0 0 3.5px rgba(0,123,255,0.12); }
.field--error .input { border-color: #ef4444; background: #fffafa; }
.input-wrap .input { padding-right: 2.6rem; }
.eye { position: absolute; right: 0.75rem; background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.2rem; display: flex; align-items: center; transition: color 0.18s; }
.eye:hover { color: #374151; }
.eye svg { width: 16px; height: 16px; display: block; }
.field-msg { font-size: 0.74rem; color: #ef4444; padding-left: 0.2rem; }

/* ── CHECKBOX ───────────────────────────────────────── */
.check-row { display: flex; align-items: center; gap: 0.55rem; cursor: pointer; user-select: none; margin-bottom: 1.25rem; }
.check-input { display: none; }
.check-box { width: 17px; height: 17px; border: 1.5px solid #d1d5db; border-radius: 5px; background: #f9fafb; position: relative; flex-shrink: 0; transition: all 0.18s; }
.check-input:checked + .check-box { background: #007BFF; border-color: #007BFF; }
.check-input:checked + .check-box::after { content: ''; position: absolute; left: 4px; top: 1px; width: 5px; height: 9px; border: 2px solid #fff; border-top: none; border-left: none; transform: rotate(45deg); }
.check-text { font-size: 0.82rem; color: #6C757D; }

/* ── BUTTONS ────────────────────────────────────────── */
.btn-primary { width: 100%; padding: 0.88rem; background: linear-gradient(135deg, #007BFF 0%, #0056d6 100%); border: none; border-radius: 11px; color: #fff; font-size: 0.95rem; font-weight: 700; font-family: inherit; cursor: pointer; letter-spacing: 0.01em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 18px rgba(0,86,255,0.32); min-height: 48px; }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,86,255,0.4); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.25rem 0 0.9rem; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
.divider span { font-size: 0.75rem; color: #b0b8c4; white-space: nowrap; }

.btn-secondary { display: block; width: 100%; padding: 0.82rem; border: 1.5px solid #007BFF; border-radius: 11px; color: #007BFF; font-size: 0.9rem; font-weight: 600; font-family: inherit; text-align: center; text-decoration: none; transition: background 0.18s, transform 0.15s; letter-spacing: 0.01em; }
.btn-secondary:hover { background: #eff6ff; transform: translateY(-1px); }

/* ── FOOTER ─────────────────────────────────────────── */
.footer { padding: 0.85rem 2rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid rgba(0,0,0,0.06); background: rgba(255,255,255,0.75); backdrop-filter: blur(8px); flex-shrink: 0; }
.footer a, .footer span { font-size: 0.72rem; color: #b0b8c4; text-decoration: none; }
.footer a:hover { color: #007BFF; }

/* ── TRANSITIONS ────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: all 0.22s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 480px) {
  .card { padding: 1.75rem 1.25rem; border-radius: 18px; }
  .main { padding: 0.75rem; }
  .topbar-logo { height: 52px; }
}
</style>