<template>
    <div class="page">

        <!-- TOPBAR -->
        <header class="topbar">
            <img src="@/assets/nexofin_logo.png" alt="NexoFin" class="topbar-logo" />
            <div class="admin-pill">
                <span class="admin-pill__dot"></span>
                Acceso Administrativo
            </div>
        </header>

        <!-- FONDO ANIMADO -->
        <div class="bg">
            <div class="bg-orb bg-orb--1"></div>
            <div class="bg-orb bg-orb--2"></div>
            <div class="bg-orb bg-orb--3"></div>
            <div class="bg-grid"></div>
        </div>

        <!-- MAIN -->
        <main class="main">
            <div class="card">
                <!-- Barra superior -->
                <div class="card-bar"></div>

                <!-- Icono -->
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>

                <span class="card-badge">👑 Panel Administrativo</span>
                <h1 class="title">Acceso Restringido</h1>
                <p class="subtitle">Solo personal autorizado de NexoFin</p>

                <!-- Alertas -->
                <Transition name="fade">
                    <div v-if="errorMsg" class="alert alert--error">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                        {{ errorMsg }}
                    </div>
                </Transition>

                <Transition name="fade">
                    <div v-if="notAdminError" class="alert alert--warn">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        No tienes permisos de administrador
                    </div>
                </Transition>

                <!-- FORM -->
                <form @submit.prevent="handleLogin" novalidate>

                    <div class="field" :class="{ 'field--error': errors.email }">
                        <label class="label">Correo electrónico</label>
                        <div class="input-wrap">
                            <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <input v-model="form.email" type="email" class="input" placeholder="admin@nexofin.com"
                                @input="errors.email = ''; errorMsg = ''; notAdminError = false" />
                        </div>
                        <span v-if="errors.email" class="field-msg">{{ errors.email }}</span>
                    </div>

                    <div class="field" :class="{ 'field--error': errors.password }">
                        <label class="label">Contraseña</label>
                        <div class="input-wrap">
                            <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <input v-model="form.password" :type="show ? 'text' : 'password'" class="input"
                                placeholder="••••••••"
                                @input="errors.password = ''; errorMsg = ''; notAdminError = false" />
                            <button type="button" class="eye" @click="show = !show" tabindex="-1">
                                <svg v-if="!show" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.8">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </button>
                        </div>
                        <span v-if="errors.password" class="field-msg">{{ errors.password }}</span>
                    </div>

                    <button type="submit" class="btn-primary" :disabled="loading">
                        <span v-if="loading" class="spinner"></span>
                        <template v-else>
                            <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px">
                                <path fill-rule="evenodd"
                                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Ingresar al panel
                        </template>
                    </button>

                </form>

                <div class="divider"><span>¿No tienes cuenta admin?</span></div>
                <router-link to="/admin/register" class="btn-secondary">Registrar nuevo administrador</router-link>

                <div class="divider"><span>¿Eres usuario regular?</span></div>
                <router-link to="/login" class="btn-ghost">Ir al login normal →</router-link>

                <p class="security-note">🔒 Acceso monitoreado y registrado por NexoFin</p>
            </div>
        </main>

        <footer class="footer">
            <span>© 2025 NexoFin S.A. — Panel Administrativo</span>
        </footer>

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const show = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const notAdminError = ref(false)

const form = reactive({ email: '', password: '' })
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
    loading.value = true
    errorMsg.value = ''
    notAdminError.value = false

    await authStore.login({ email: form.email, password: form.password })

    if (!authStore.error) {
        if (authStore.user?.role !== 'admin') {
            notAdminError.value = true
            authStore.logout()
            loading.value = false
            return
        }
        router.push('/admin/dashboard')
    } else {
        errorMsg.value = authStore.error
    }
    loading.value = false
}
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

.page {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8f9ff;
    position: relative;
    overflow: hidden;
}

/* BG */
.bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

.bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: drift 14s ease-in-out infinite alternate;
}

.bg-orb--1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%);
    top: -200px;
    left: -150px;
    animation-duration: 16s;
}

.bg-orb--2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 60, 180, 0.07) 0%, transparent 70%);
    bottom: -150px;
    right: -100px;
    animation-duration: 12s;
    animation-delay: -5s;
}

.bg-orb--3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(0, 123, 255, 0.05) 0%, transparent 70%);
    top: 50%;
    left: 55%;
    animation-duration: 18s;
    animation-delay: -9s;
}

@keyframes drift {
    from {
        transform: translate(0, 0) scale(1);
    }

    to {
        transform: translate(30px, 25px) scale(1.05);
    }
}

.bg-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px);
    background-size: 52px 52px;
}

/* TOPBAR */
.topbar {
    position: relative;
    z-index: 10;
    padding: 0.9rem 2rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.05);
}

.topbar-logo {
    height: 42px;
    width: auto;
    object-fit: contain;
}

.admin-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #1a202c, #2d3748);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.45rem 1rem;
    border-radius: 99px;
    letter-spacing: 0.02em;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.admin-pill__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ffc107;
    box-shadow: 0 0 6px #ffc107;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(0.8);
    }
}

/* MAIN */
.main {
    flex: 1;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
}

/* CARD */
.card {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 2.25rem 2.5rem 2rem;
    width: 100%;
    max-width: 430px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03), 0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-bar {
    position: absolute;
    top: 0;
    left: 8%;
    right: 8%;
    height: 3px;
    background: linear-gradient(90deg, #007BFF, #1a202c, #ffc107);
    border-radius: 0 0 6px 6px;
}

.card-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #1a202c, #2d3748);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: #ffc107;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-icon svg {
    width: 24px;
    height: 24px;
}

.card-badge {
    display: block;
    text-align: center;
    width: fit-content;
    margin: 0 auto 0.75rem;
    background: linear-gradient(135deg, rgba(26, 32, 44, 0.08), rgba(26, 32, 44, 0.04));
    color: #1a202c;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.3rem 0.85rem;
    border-radius: 99px;
    border: 1px solid rgba(26, 32, 44, 0.12);
    letter-spacing: 0.02em;
}

.title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a202c;
    margin-bottom: 0.25rem;
    letter-spacing: -0.035em;
    text-align: center;
}

.subtitle {
    font-size: 0.875rem;
    color: #6C757D;
    margin-bottom: 1.75rem;
    text-align: center;
}

/* ALERTS */
.alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.83rem;
    margin-bottom: 1.25rem;
    font-family: 'Inter', sans-serif;
}

.alert svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
}

.alert--error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    color: #c0392b;
}

.alert--warn {
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
}

/* FIELDS */
.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1.1rem;
}

.label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
}

.input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 0.9rem;
    width: 15px;
    height: 15px;
    color: #9ca3af;
    pointer-events: none;
}

.input {
    width: 100%;
    padding: 0.82rem 0.9rem 0.82rem 2.55rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 0.9rem;
    font-family: inherit;
    color: #1a202c;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.input::placeholder {
    color: #b0b8c4;
}

.input:focus {
    border-color: #1a202c;
    background: #fff;
    box-shadow: 0 0 0 3.5px rgba(26, 32, 44, 0.08);
}

.field--error .input {
    border-color: #ef4444;
    background: #fffafa;
}

.input-wrap .input {
    padding-right: 2.6rem;
}

.eye {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    transition: color 0.18s;
}

.eye:hover {
    color: #374151;
}

.eye svg {
    width: 16px;
    height: 16px;
}

.field-msg {
    font-size: 0.74rem;
    color: #ef4444;
    padding-left: 0.2rem;
}

/* BUTTON */
.btn-primary {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
    min-height: 50px;
    margin-bottom: 1.25rem;
    letter-spacing: 0.01em;
    position: relative;
    overflow: hidden;
}

.btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.12), transparent);
    opacity: 0;
    transition: opacity 0.2s;
}

.btn-primary:hover:not(:disabled)::after {
    opacity: 1;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.9rem;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
}

.divider span {
    font-size: 0.75rem;
    color: #b0b8c4;
    white-space: nowrap;
}

.btn-secondary {
    display: block;
    width: 100%;
    padding: 0.85rem;
    border: 1.5px solid #1a202c;
    border-radius: 12px;
    color: #1a202c;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: inherit;
    text-align: center;
    text-decoration: none;
    transition: background 0.18s, color 0.15s;
    margin-bottom: 1rem;
}

.btn-secondary:hover {
    background: #1a202c;
    color: #fff;
}

.btn-ghost {
    display: block;
    text-align: center;
    text-decoration: none;
    font-size: 0.82rem;
    color: #6C757D;
    font-family: inherit;
    padding: 0.4rem;
    transition: color 0.15s;
    margin-bottom: 1rem;
}

.btn-ghost:hover {
    color: #007BFF;
}

.security-note {
    text-align: center;
    font-size: 0.72rem;
    color: #9ca3af;
    margin-top: 0.5rem;
}

/* FOOTER */
.footer {
    position: relative;
    z-index: 1;
    padding: 1rem 2rem;
    text-align: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
}

.footer span {
    font-size: 0.72rem;
    color: #b0b8c4;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.22s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@media (max-width: 480px) {
    .card {
        padding: 1.75rem 1.25rem;
        border-radius: 18px;
    }

    .main {
        padding: 1rem;
    }
}
</style>