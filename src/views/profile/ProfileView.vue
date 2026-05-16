<template>
    <div class="dashboard-layout">

        <!-- SIDEBAR -->
        <aside class="sidebar" :class="{ collapsed: isCollapsed }">
            <div class="sidebar-header">
                <img v-if="!isCollapsed" src="@/assets/nexofin_logo.png" alt="NexoFin" class="sidebar-logo" />
                <button class="sidebar-toggle" @click="isCollapsed = !isCollapsed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path v-if="!isCollapsed" d="M15 18l-6-6 6-6" />
                        <path v-else d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <button class="new-payment-btn" :class="{ 'new-payment-btn--collapsed': isCollapsed }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                <span v-if="!isCollapsed">Nuevo Pago</span>
            </button>

            <nav class="sidebar-nav">
                <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="sidebar-link"
                    :class="{ active: $route.path === item.path }" :title="item.label">
                    <span class="sidebar-link__icon" v-html="item.icon"></span>
                    <span class="sidebar-link__label" v-if="!isCollapsed">{{ item.label }}</span>
                </router-link>
            </nav>

            <div class="sidebar-footer">
                <router-link to="/profile" class="sidebar-profile"
                    :class="{ 'sidebar-profile--collapsed': isCollapsed }">
                    <div class="user-avatar">{{ userInitials }}</div>
                    <div class="user-info" v-if="!isCollapsed">
                        <div class="user-name">{{ authStore.user?.name || 'Usuario' }}</div>
                        <div class="user-role">{{ roleLabel }}</div>
                        <div class="user-edit">⚙️ Editar perfil</div>
                    </div>
                </router-link>
                <button class="logout-btn" @click="handleLogout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    <span v-if="!isCollapsed">Cerrar sesión</span>
                </button>
            </div>
        </aside>

        <!-- MAIN -->
        <main class="dashboard-main" :class="{ expanded: isCollapsed }">

            <header class="topbar">
                <h1 class="page-title">Mi Perfil</h1>
                <div class="topbar-user">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                        class="topbar-avatar-icon">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{{ authStore.user?.name || 'Usuario' }}</span>
                </div>
            </header>

            <div class="content">

                <!-- HERO -->
                <div class="profile-hero">
                    <div class="profile-avatar">{{ userInitials }}</div>
                    <div class="profile-info">
                        <h2 class="profile-name">{{ authStore.user?.name || 'Usuario' }}</h2>
                        <div class="profile-role-badge">{{ roleLabel }}</div>
                        <p class="profile-email">{{ authStore.user?.email || '' }}</p>
                    </div>
                </div>

                <!-- FILA 1: Info personal + Cambiar contraseña -->
                <div class="profile-grid">

                    <!-- Información Personal -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <h3 class="profile-card-title">Información Personal</h3>
                        </div>
                        <div class="profile-card-body">
                            <div class="alerts-wrap">
                                <Transition name="fade">
                                    <div v-if="successMsg" class="alert alert--success">✅ {{ successMsg }}</div>
                                </Transition>
                                <Transition name="fade">
                                    <div v-if="errorMsg" class="alert alert--error">❌ {{ errorMsg }}</div>
                                </Transition>
                            </div>
                            <div class="form-grid">
                                <div class="field">
                                    <label class="label">Nombre</label>
                                    <input v-model="form.nombre" class="input" placeholder="Tu nombre" />
                                </div>
                                <div class="field">
                                    <label class="label">Apellido</label>
                                    <input v-model="form.apellido" class="input" placeholder="Tu apellido" />
                                </div>
                                <div class="field">
                                    <label class="label">Teléfono</label>
                                    <input v-model="form.telefono" class="input" placeholder="300 123 4567" />
                                </div>
                                <div class="field">
                                    <label class="label">Documento de identidad</label>
                                    <input v-model="form.documento" class="input" placeholder="CC 1234567890"
                                        disabled />
                                    <span class="field-hint">No puede ser modificado</span>
                                </div>
                            </div>
                            <button class="btn-save" :disabled="saving" @click="handleSave">
                                <span v-if="saving" class="spinner"></span>
                                <span v-else>Guardar cambios</span>
                            </button>
                        </div>
                    </div>

                    <!-- Cambiar Contraseña -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <h3 class="profile-card-title">Cambiar Contraseña</h3>
                        </div>
                        <div class="profile-card-body">
                            <div class="alerts-wrap">
                                <Transition name="fade">
                                    <div v-if="passSuccess" class="alert alert--success">✅ {{ passSuccess }}</div>
                                </Transition>
                                <Transition name="fade">
                                    <div v-if="passError" class="alert alert--error">❌ {{ passError }}</div>
                                </Transition>
                            </div>

                            <!-- PASO 1 -->
                            <div v-if="passStep === 1" class="step-content">
                                <p class="step-info">Te enviaremos un código de verificación a tu correo registrado.</p>
                                <div class="field">
                                    <label class="label">Correo registrado</label>
                                    <input :value="authStore.user?.email" class="input" disabled />
                                </div>
                                <button class="btn-save" :disabled="sendingCode" @click="handleSendCode">
                                    <span v-if="sendingCode" class="spinner"></span>
                                    <span v-else>📧 Enviar código al correo</span>
                                </button>
                            </div>

                            <!-- PASO 2 -->
                            <div v-if="passStep === 2" class="step-content">
                                <div class="form-grid">
                                    <div class="field field--full">
                                        <label class="label">Código de verificación</label>
                                        <input v-model="pass.code" class="input" placeholder="Código de 6 dígitos"
                                            maxlength="6" />
                                        <span class="field-hint">Revisa tu correo — expira en 10 minutos</span>
                                    </div>
                                    <div class="field">
                                        <label class="label">Nueva contraseña</label>
                                        <input v-model="pass.new" type="password" class="input"
                                            placeholder="••••••••" />
                                    </div>
                                    <div class="field">
                                        <label class="label">Confirmar contraseña</label>
                                        <input v-model="pass.confirm" type="password" class="input"
                                            placeholder="••••••••" />
                                    </div>
                                </div>
                                <div class="pass-rules">
                                    <div class="pass-rule" :class="{ ok: pass.new.length >= 8 }">{{ pass.new.length >= 8
                                        ? '✅' : '⬜' }} Mínimo 8 caracteres</div>
                                    <div class="pass-rule" :class="{ ok: /[A-Z]/.test(pass.new) }">{{
                                        /[A-Z]/.test(pass.new) ? '✅' : '⬜' }} Al menos una mayúscula</div>
                                    <div class="pass-rule" :class="{ ok: /[0-9]/.test(pass.new) }">{{
                                        /[0-9]/.test(pass.new) ? '✅' : '⬜' }} Al menos un número</div>
                                </div>
                                <div class="btn-row">
                                    <button class="btn-outline-sm" @click="passStep = 1">← Volver</button>
                                    <button class="btn-save btn-save--flex" :disabled="savingPass"
                                        @click="handleChangePassword">
                                        <span v-if="savingPass" class="spinner"></span>
                                        <span v-else>Cambiar contraseña</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- FILA 2: Cambiar correo + Info cuenta -->
                <div class="profile-grid">

                    <!-- Cambiar Correo -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <h3 class="profile-card-title">Cambiar Correo Electrónico</h3>
                        </div>
                        <div class="profile-card-body">
                            <div class="alerts-wrap">
                                <Transition name="fade">
                                    <div v-if="emailSuccess" class="alert alert--success">✅ {{ emailSuccess }}</div>
                                </Transition>
                                <Transition name="fade">
                                    <div v-if="emailError" class="alert alert--error">❌ {{ emailError }}</div>
                                </Transition>
                            </div>

                            <!-- PASO 1: Solicitar código -->
                            <div v-if="emailStep === 1" class="step-content">
                                <p class="step-info">Te enviaremos un código al correo actual para verificar tu
                                    identidad antes de cambiarlo.</p>
                                <div class="field">
                                    <label class="label">Correo actual</label>
                                    <input :value="authStore.user?.email" class="input" disabled />
                                </div>
                                <button class="btn-save" :disabled="sendingEmailCode" @click="handleSendEmailCode">
                                    <span v-if="sendingEmailCode" class="spinner"></span>
                                    <span v-else>📧 Enviar código de verificación</span>
                                </button>
                            </div>

                            <!-- PASO 2: Ingresar código y nuevo correo -->
                            <div v-if="emailStep === 2" class="step-content">
                                <div class="form-grid">
                                    <div class="field field--full">
                                        <label class="label">Código de verificación</label>
                                        <input v-model="emailForm.code" class="input" placeholder="Código de 6 dígitos"
                                            maxlength="6" />
                                        <span class="field-hint">Revisa tu correo actual — expira en 10 minutos</span>
                                    </div>
                                    <div class="field field--full">
                                        <label class="label">Nuevo correo electrónico</label>
                                        <input v-model="emailForm.newEmail" type="email" class="input"
                                            placeholder="nuevo@correo.com" />
                                    </div>
                                    <div class="field field--full">
                                        <label class="label">Confirmar nuevo correo</label>
                                        <input v-model="emailForm.confirmEmail" type="email" class="input"
                                            placeholder="nuevo@correo.com" />
                                    </div>
                                </div>
                                <div class="btn-row">
                                    <button class="btn-outline-sm" @click="emailStep = 1">← Volver</button>
                                    <button class="btn-save btn-save--flex" :disabled="savingEmail"
                                        @click="handleChangeEmail">
                                        <span v-if="savingEmail" class="spinner"></span>
                                        <span v-else>Cambiar correo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Información de Cuenta -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <h3 class="profile-card-title">Información de Cuenta</h3>
                        </div>
                        <div class="profile-card-body">
                            <div class="info-item">
                                <span class="info-label">Rol</span>
                                <span class="info-value">{{ roleLabel }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Estado</span>
                                <span class="info-badge info-badge--active">Activo</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Correo registrado</span>
                                <span class="info-value">{{ authStore.user?.email }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Miembro desde</span>
                                <span class="info-value">2025</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Último acceso</span>
                                <span class="info-value">Hoy</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

// ── Info personal ─────────────────────────────────────
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const form = ref({ nombre: '', apellido: '', telefono: '', documento: '' })

// ── Cambiar contraseña ────────────────────────────────
const savingPass = ref(false)
const sendingCode = ref(false)
const passSuccess = ref('')
const passError = ref('')
const passStep = ref(1)
const pass = ref({ code: '', new: '', confirm: '' })

// ── Cambiar correo ────────────────────────────────────
const savingEmail = ref(false)
const sendingEmailCode = ref(false)
const emailSuccess = ref('')
const emailError = ref('')
const emailStep = ref(1)
const emailForm = ref({ code: '', newEmail: '', confirmEmail: '' })

// ── Computed ──────────────────────────────────────────
const userInitials = computed(() => {
    const name = authStore.user?.name || 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const roleLabel = computed(() => {
    const role = authStore.user?.role
    if (role === 'admin') return 'Administrador'
    if (role === 'cajero') return 'Cajero'
    return 'Cliente'
})

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

onMounted(() => {
    const name = authStore.user?.name || ''
    const parts = name.split(' ')
    form.value.nombre = parts[0] || ''
    form.value.apellido = parts.slice(1).join(' ') || ''
})

// ── Guardar info personal ─────────────────────────────
const handleSave = async () => {
    saving.value = true
    successMsg.value = ''
    errorMsg.value = ''
    try {
        await new Promise(r => setTimeout(r, 800))
        successMsg.value = 'Perfil actualizado correctamente'
        setTimeout(() => successMsg.value = '', 3000)
    } catch (e) {
        errorMsg.value = 'Error al guardar los cambios'
    } finally {
        saving.value = false
    }
}

// ── Enviar código contraseña ──────────────────────────
const handleSendCode = async () => {
    sendingCode.value = true
    passError.value = ''
    passSuccess.value = ''
    try {
        await api.post('/auth/send-code', { email: authStore.user?.email })
        passSuccess.value = '📧 Código enviado a tu correo'
        passStep.value = 2
        setTimeout(() => passSuccess.value = '', 4000)
    } catch (e) {
        passError.value = e.response?.data?.message || 'Error al enviar el código'
    } finally {
        sendingCode.value = false
    }
}

// ── Cambiar contraseña ────────────────────────────────
const handleChangePassword = async () => {
    passError.value = ''
    passSuccess.value = ''
    if (!pass.value.code) { passError.value = 'Ingresa el código de verificación'; return }
    if (pass.value.new.length < 8) { passError.value = 'Mínimo 8 caracteres'; return }
    if (!/[A-Z]/.test(pass.value.new)) { passError.value = 'Necesita al menos una mayúscula'; return }
    if (!/[0-9]/.test(pass.value.new)) { passError.value = 'Necesita al menos un número'; return }
    if (pass.value.new !== pass.value.confirm) { passError.value = 'Las contraseñas no coinciden'; return }

    savingPass.value = true
    try {
        await api.post('/auth/verify-code', {
            email: authStore.user?.email,
            code: pass.value.code,
            newPassword: pass.value.new,
        })
        passSuccess.value = '✅ Contraseña cambiada correctamente'
        pass.value = { code: '', new: '', confirm: '' }
        passStep.value = 1
        setTimeout(() => passSuccess.value = '', 3000)
    } catch (e) {
        passError.value = e.response?.data?.message || 'Error al cambiar la contraseña'
    } finally {
        savingPass.value = false
    }
}

// ── Enviar código correo ──────────────────────────────
const handleSendEmailCode = async () => {
    sendingEmailCode.value = true
    emailError.value = ''
    emailSuccess.value = ''
    try {
        await api.post('/auth/send-code', { email: authStore.user?.email })
        emailSuccess.value = '📧 Código enviado a tu correo actual'
        emailStep.value = 2
        setTimeout(() => emailSuccess.value = '', 4000)
    } catch (e) {
        emailError.value = e.response?.data?.message || 'Error al enviar el código'
    } finally {
        sendingEmailCode.value = false
    }
}

// ── Cambiar correo ────────────────────────────────────
const handleChangeEmail = async () => {
    emailError.value = ''
    emailSuccess.value = ''
    if (!emailForm.value.code) { emailError.value = 'Ingresa el código de verificación'; return }
    if (!emailForm.value.newEmail) { emailError.value = 'Ingresa el nuevo correo'; return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.value.newEmail)) { emailError.value = 'Correo inválido'; return }
    if (emailForm.value.newEmail !== emailForm.value.confirmEmail) { emailError.value = 'Los correos no coinciden'; return }
    if (emailForm.value.newEmail === authStore.user?.email) { emailError.value = 'El nuevo correo es igual al actual'; return }

    savingEmail.value = true
    try {
        await api.post('/auth/change-email', {
            currentEmail: authStore.user?.email,
            code: emailForm.value.code,
            newEmail: emailForm.value.newEmail,
        })
        // Actualizar el store con el nuevo correo
        authStore.user.email = emailForm.value.newEmail
        localStorage.setItem('user', JSON.stringify(authStore.user))
        emailSuccess.value = '✅ Correo actualizado correctamente'
        emailForm.value = { code: '', newEmail: '', confirmEmail: '' }
        emailStep.value = 1
        setTimeout(() => emailSuccess.value = '', 3000)
    } catch (e) {
        emailError.value = e.response?.data?.message || 'Error al cambiar el correo'
    } finally {
        savingEmail.value = false
    }
}

const menuItems = [
    { path: '/dashboard', label: 'Inicio', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { path: '/accounts', label: 'Cuentas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
    { path: '/transactions', label: 'Pagos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>' },
    { path: '/loans', label: 'Préstamos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
    { path: '/settings', label: 'Ajustes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.dashboard-layout {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #f0f4ff;
}

/* SIDEBAR */
.sidebar {
    width: 240px;
    min-height: 100vh;
    background: #fff;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0.75rem;
    transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
}

.sidebar.collapsed {
    width: 72px;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem 1.25rem;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1rem;
}

.sidebar-logo {
    height: 34px;
    width: auto;
    max-width: 130px;
    object-fit: contain;
}

.sidebar-toggle {
    background: #f8f9fa;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
}

.sidebar-toggle svg {
    width: 16px;
    height: 16px;
    color: #6C757D;
}

.sidebar-toggle:hover {
    background: #e9ecef;
}

.new-payment-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 14px rgba(0, 86, 255, 0.3);
}

.new-payment-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.new-payment-btn:hover {
    transform: translateY(-1px);
}

.new-payment-btn--collapsed {
    justify-content: center;
    padding: 0.75rem;
}

.sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    text-decoration: none;
    color: #6C757D;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, color 0.15s;
}

.sidebar-link__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-link__icon :deep(svg) {
    width: 18px;
    height: 18px;
}

.sidebar-link:hover {
    background: #f0f7ff;
    color: #007BFF;
}

.sidebar-link.active {
    background: #f0f7ff;
    color: #007BFF;
    font-weight: 600;
}

.sidebar-footer {
    border-top: 1px solid #f0f0f0;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-profile {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.75rem 0.85rem;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.15s;
    border: 1px solid #f0f0f0;
}

.sidebar-profile:hover {
    background: #f0f7ff;
    border-color: rgba(0, 123, 255, 0.2);
}

.sidebar-profile--collapsed {
    justify-content: center;
    padding: 0.75rem;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #007BFF, #0041a8);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
}

.user-info {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    font-size: 0.7rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
}

.user-edit {
    font-size: 0.68rem;
    color: #007BFF;
    margin-top: 0.15rem;
    font-family: 'Inter', sans-serif;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.6rem 0.85rem;
    border-radius: 10px;
    background: none;
    border: none;
    color: #6C757D;
    font-size: 0.82rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.logout-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.logout-btn:hover {
    background: #fff5f5;
    color: #dc3545;
}

/* MAIN */
.dashboard-main {
    margin-left: 240px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-main.expanded {
    margin-left: 72px;
}

.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 40;
}

.page-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.topbar-user {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    font-family: 'Inter', sans-serif;
}

.topbar-avatar-icon {
    width: 32px;
    height: 32px;
    color: #6C757D;
}

/* CONTENT */
.content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}

/* HERO */
.profile-hero {
    background: linear-gradient(135deg, #007BFF, #0041a8);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 1.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
}

.profile-name {
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.02em;
    margin-bottom: 0.35rem;
}

.profile-role-badge {
    display: inline-flex;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.8rem;
    border-radius: 99px;
    margin-bottom: 0.35rem;
    font-family: 'Inter', sans-serif;
}

.profile-email {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    font-family: 'Inter', sans-serif;
}

/* GRID */
.profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.profile-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e9ecef;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
}

.profile-card-header {
    padding: 1.1rem 1.5rem 0.75rem;
    border-bottom: 1px solid #f5f5f5;
}

.profile-card-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.profile-card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    justify-content: space-between;
}

.alerts-wrap {
    min-height: 0;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
}

/* FORM */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.field--full {
    grid-column: span 2;
}

.label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    font-family: 'Inter', sans-serif;
}

.input {
    padding: 0.75rem 1rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    color: #1a202c;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
}

.input:focus {
    border-color: #007BFF;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.field-hint {
    font-size: 0.72rem;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
}

/* ALERTS */
.alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-size: 0.83rem;
    font-family: 'Inter', sans-serif;
}

.alert--success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
}

.alert--error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    color: #991b1b;
}

/* PASS RULES */
.step-info {
    font-size: 0.85rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
}

.pass-rules {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.pass-rule {
    font-size: 0.78rem;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
}

.pass-rule.ok {
    color: #28A745;
}

/* BUTTONS */
.btn-row {
    display: flex;
    gap: 0.75rem;
}

.btn-save {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 14px rgba(0, 86, 255, 0.3);
}

.btn-save--flex {
    flex: 1;
    width: auto;
}

.btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 86, 255, 0.4);
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-outline-sm {
    padding: 0.85rem 1.25rem;
    background: transparent;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    color: #6C757D;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
}

.btn-outline-sm:hover {
    background: #f8f9fa;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* INFO */
.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 0.85rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
}

.info-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
    max-width: 60%;
    text-align: right;
    word-break: break-all;
}

.info-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    font-family: 'Inter', sans-serif;
}

.info-badge--active {
    background: rgba(40, 167, 69, 0.1);
    color: #28A745;
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

@media (max-width: 900px) {
    .sidebar {
        display: none;
    }

    .dashboard-main {
        margin-left: 0;
    }

    .profile-grid {
        grid-template-columns: 1fr;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .field--full {
        grid-column: span 1;
    }
}
</style>