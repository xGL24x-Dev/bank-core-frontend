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
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h1 class="title">Crear cuenta</h1>
        <p class="subtitle">Únete a NexoFin en segundos</p>

        <Transition name="fade">
          <div v-if="authStore.error" class="alert alert--error">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
            {{ authStore.error }}
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="success" class="alert alert--success">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            ¡Cuenta creada! Redirigiendo...
          </div>
        </Transition>

        <form @submit.prevent="handleRegister" novalidate>

          <div class="row-2">
            <div class="field" :class="{ 'field--error': errors.name }">
              <label class="label">Nombre</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                <input v-model="form.name" type="text" class="input" placeholder="Carlos"
                  autocomplete="given-name" @input="errors.name = ''" />
              </div>
              <span v-if="errors.name" class="field-msg">{{ errors.name }}</span>
            </div>

            <div class="field" :class="{ 'field--error': errors.lastname }">
              <label class="label">Apellido</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                <input v-model="form.lastname" type="text" class="input" placeholder="Díaz"
                  autocomplete="family-name" @input="errors.lastname = ''" />
              </div>
              <span v-if="errors.lastname" class="field-msg">{{ errors.lastname }}</span>
            </div>
          </div>

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
            <label class="label">Contraseña</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" class="input"
                placeholder="Mínimo 8 caracteres" autocomplete="new-password"
                @input="errors.password = ''" />
              <button type="button" class="eye" @click="showPass = !showPass" tabindex="-1">
                <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <div v-if="form.password" class="strength">
              <div class="strength-track">
                <div v-for="i in 4" :key="i" class="seg" :class="segClass(i)"></div>
              </div>
              <span class="strength-txt" :class="strengthColor">{{ strengthLabel }}</span>
            </div>
            <span v-if="errors.password" class="field-msg">{{ errors.password }}</span>
          </div>

          <div class="field" :class="{ 'field--error': errors.password2 }">
            <label class="label">Confirmar contraseña</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <input v-model="form.password2" type="password" class="input"
                placeholder="Repite tu contraseña" autocomplete="new-password"
                @input="errors.password2 = ''" />
            </div>
            <span v-if="errors.password2" class="field-msg">{{ errors.password2 }}</span>
          </div>

          <p class="terms-txt">
            Al crear una cuenta aceptas los
            <a href="#" class="link-sm">Términos de uso</a> y la
            <a href="#" class="link-sm">Política de privacidad</a> de NexoFin.
          </p>

          <button type="submit" class="btn-primary" :disabled="authStore.loading || success">
            <span v-if="authStore.loading" class="spinner"></span>
            <template v-else>
              <svg viewBox="0 0 20 20" fill="currentColor" style="width:17px;height:17px">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
              </svg>
              Crear cuenta
            </template>
          </button>

        </form>

        <div class="divider"><span>¿Ya tienes cuenta?</span></div>
        <router-link to="/login" class="btn-secondary">Iniciar sesión</router-link>
      </div>
    </main>

    <footer class="footer">
      <span>© 2025 NexoFin S.A.</span>
    </footer>

  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router    = useRouter()
const authStore = useAuthStore()
const showPass  = ref(false)
const success   = ref(false)

const form   = reactive({ name: '', lastname: '', email: '', password: '', password2: '' })
const errors = reactive({ name: '', lastname: '', email: '', password: '', password2: '' })

const strength = computed(() => {
  const p = form.password; if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^a-zA-Z0-9]/.test(p)) s++
  return s
})
const strengthLabel = computed(() => ['','Débil','Regular','Buena','Fuerte'][strength.value] || '')
const strengthColor = computed(() => ['','weak','fair','good','strong'][strength.value] || '')
function segClass(i) {
  if (i > strength.value) return ''
  return ['','seg--weak','seg--fair','seg--good','seg--strong'][strength.value]
}

function validate() {
  Object.keys(errors).forEach(k => errors[k] = '')
  let ok = true
  if (!form.name.trim())     { errors.name     = 'El nombre es requerido'; ok = false }
  if (!form.lastname.trim()) { errors.lastname  = 'El apellido es requerido'; ok = false }
  if (!form.email)           { errors.email     = 'El correo es requerido'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Correo inválido'; ok = false }
  if (!form.password)        { errors.password  = 'La contraseña es requerida'; ok = false }
  else if (form.password.length < 8) { errors.password = 'Mínimo 8 caracteres'; ok = false }
  else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) { errors.password = 'Necesita mayúscula y número'; ok = false }
  if (form.password !== form.password2) { errors.password2 = 'Las contraseñas no coinciden'; ok = false }
  return ok
}

async function handleRegister() {
  if (!validate()) return
  await authStore.register({
    name: `${form.name.trim()} ${form.lastname.trim()}`,
    email: form.email,
    password: form.password,
  })
  if (!authStore.error) {
    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  }
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
.bg-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(70px); animation: drift 12s ease-in-out infinite alternate; }
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
  padding: 1.75rem 2.5rem 1.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 0 0 1px rgba(0,123,255,0.07), 0 8px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,86,255,0.08);
  animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

.card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 3px; background: linear-gradient(90deg, #007BFF, #28A745); border-radius: 0 0 4px 4px; }

.card-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #dbeafe, #bbf7d0); border-radius: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; border: 1px solid rgba(0,123,255,0.12); }

.title { font-size: 1.75rem; font-weight: 800; color: #1a202c; margin-bottom: 0.25rem; letter-spacing: -0.035em; text-align: center; }
.subtitle { font-size: 0.875rem; color: #6C757D; margin-bottom: 1.5rem; text-align: center; }

/* ── ALERTS ─────────────────────────────────────────── */
.alert { display: flex; align-items: center; gap: 0.5rem; border-radius: 10px; padding: 0.65rem 0.9rem; font-size: 0.82rem; margin-bottom: 1rem; }
.alert svg { width: 14px; height: 14px; flex-shrink: 0; }
.alert--error  { background: #fff5f5; border: 1px solid #fcc; color: #c0392b; }
.alert--success { background: #f0fff4; border: 1px solid #b2dfdb; color: #1b7a4a; }

/* ── FIELDS ─────────────────────────────────────────── */
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.field { display: flex; flex-direction: column; gap: 0.32rem; margin-bottom: 0.85rem; }
.label { font-size: 0.79rem; font-weight: 600; color: #374151; letter-spacing: 0.01em; }
.link-sm { font-size: 0.78rem; color: #007BFF; text-decoration: none; }
.link-sm:hover { text-decoration: underline; }

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 0.9rem; width: 14px; height: 14px; color: #9ca3af; pointer-events: none; }
.input { width: 100%; padding: 0.72rem 0.9rem 0.72rem 2.5rem; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 0.88rem; font-family: inherit; color: #1a202c; background: #f9fafb; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; }
.input::placeholder { color: #b0b8c4; }
.input:focus { border-color: #007BFF; background: #fff; box-shadow: 0 0 0 3px rgba(0,123,255,0.12); }
.field--error .input { border-color: #ef4444; background: #fffafa; }
.input-wrap .input { padding-right: 2.5rem; }
.eye { position: absolute; right: 0.72rem; background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.2rem; display: flex; align-items: center; transition: color 0.18s; }
.eye:hover { color: #374151; }
.eye svg { width: 15px; height: 15px; display: block; }
.field-msg { font-size: 0.72rem; color: #ef4444; padding-left: 0.2rem; }

/* ── STRENGTH ───────────────────────────────────────── */
.strength { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.35rem; }
.strength-track { display: flex; gap: 3px; flex: 1; }
.seg { flex: 1; height: 3px; border-radius: 2px; background: #e5e7eb; transition: background 0.3s; }
.seg--weak   { background: #ef4444; }
.seg--fair   { background: #f97316; }
.seg--good   { background: #eab308; }
.seg--strong { background: #28A745; }
.strength-txt { font-size: 0.7rem; min-width: 42px; }
.weak   { color: #ef4444; } .fair { color: #f97316; }
.good   { color: #eab308; } .strong { color: #28A745; }

/* ── TERMS ──────────────────────────────────────────── */
.terms-txt { font-size: 0.76rem; color: #6C757D; line-height: 1.5; margin-bottom: 1rem; }

/* ── BUTTONS ────────────────────────────────────────── */
.btn-primary { width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #007BFF 0%, #0056d6 100%); border: none; border-radius: 11px; color: #fff; font-size: 0.93rem; font-weight: 700; font-family: inherit; cursor: pointer; letter-spacing: 0.01em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 18px rgba(0,86,255,0.32); min-height: 48px; }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,86,255,0.4); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.divider { display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0 0.85rem; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
.divider span { font-size: 0.74rem; color: #b0b8c4; white-space: nowrap; }

.btn-secondary { display: block; width: 100%; padding: 0.8rem; border: 1.5px solid #007BFF; border-radius: 11px; color: #007BFF; font-size: 0.9rem; font-weight: 600; font-family: inherit; text-align: center; text-decoration: none; transition: background 0.18s, transform 0.15s; letter-spacing: 0.01em; }
.btn-secondary:hover { background: #eff6ff; transform: translateY(-1px); }

/* ── FOOTER ─────────────────────────────────────────── */
.footer { padding: 0.85rem 2rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid rgba(0,0,0,0.06); background: rgba(255,255,255,0.75); backdrop-filter: blur(8px); flex-shrink: 0; }
.footer a, .footer span { font-size: 0.72rem; color: #b0b8c4; text-decoration: none; }
.footer a:hover { color: #007BFF; }

/* ── TRANSITIONS ────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: all 0.22s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 480px) {
  .card { padding: 1.5rem 1.25rem; border-radius: 18px; }
  .main { padding: 0.75rem; }
  .topbar-logo { height: 52px; }
  .row-2 { grid-template-columns: 1fr; }
}
</style>