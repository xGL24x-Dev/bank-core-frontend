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

            <button class="new-payment-btn" :class="{ 'new-payment-btn--collapsed': isCollapsed }"
                :style="{ opacity: accounts.length > 0 ? 0.5 : 1, cursor: accounts.length > 0 ? 'not-allowed' : 'pointer' }"
                @click="accounts.length === 0 ? showModal = true : null">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                <span v-if="!isCollapsed">Nueva Cuenta</span>
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
                <h1 class="page-title">Mis Cuentas</h1>
                <div class="topbar-right">
                    <div class="topbar-user">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            class="topbar-avatar-icon">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>{{ authStore.user?.name || 'Usuario' }}</span>
                    </div>
                    <button v-if="!loading && accounts.length === 0" class="btn-new" @click="showModal = true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Nueva Cuenta
                    </button>
                </div>
            </header>

            <div class="content">

                <!-- BALANCE HERO -->
                <div class="balance-hero">
                    <div class="balance-left">
                        <div class="balance-label">Saldo Total Disponible</div>
                        <div class="balance-amount">
                            <span v-if="loading">Cargando...</span>
                            <span v-else>$ {{ totalBalance }}</span>
                        </div>
                        <div class="balance-sub">{{ accounts.length }} cuenta{{ accounts.length !== 1 ? 's' : '' }}
                            activa{{ accounts.length !== 1 ? 's' : '' }}</div>
                    </div>
                    <div class="balance-icon">💳</div>
                </div>

                <!-- LOADING -->
                <div v-if="loading" class="empty-state">
                    <div class="empty-spinner"></div>
                    <p>Cargando cuentas...</p>
                </div>

                <!-- SIN CUENTAS -->
                <div v-else-if="accounts.length === 0" class="empty-state">
                    <div class="empty-icon">🏦</div>
                    <h3 class="empty-title">No tienes cuentas aún</h3>
                    <p class="empty-sub">Crea tu primera cuenta bancaria y empieza a gestionar tus finanzas en NexoFin.
                    </p>
                    <button class="btn-primary" @click="showModal = true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Crear mi primera cuenta
                    </button>
                </div>

                <!-- LISTA DE CUENTAS -->
                <div v-else class="accounts-grid">
                    <div class="account-card" v-for="acc in accounts" :key="acc.id_cuenta">
                        <div class="account-card-top"
                            :style="{ background: acc.tipo_cuenta === 'ahorros' ? 'linear-gradient(135deg,#28A745,#1a7a32)' : 'linear-gradient(135deg,#007BFF,#0041a8)' }">
                            <div class="account-card-header">
                                <div class="account-type-badge">{{ acc.tipo_cuenta === 'ahorros' ? '💰 Ahorros' : '🏢 Corriente' }}</div>
                                <div class="account-status"
                                    :class="acc.estado === 'activa' ? 'status--active' : 'status--inactive'">
                                    {{ acc.estado === 'activa' ? 'Activa' : 'Inactiva' }}
                                </div>
                            </div>
                            <div class="account-number">{{ acc.numero_cuenta }}</div>
                            <div class="account-holder">{{ authStore.user?.name || 'Titular' }}</div>
                        </div>
                        <div class="account-card-body">
                            <div class="account-balance-row">
                                <div>
                                    <div class="account-balance-label">Saldo disponible</div>
                                    <div class="account-balance-value">$ {{ Number(acc.saldo).toLocaleString('es-CO') }}
                                    </div>
                                </div>
                                <div class="account-actions">
                                    <button class="action-pill action-pill--blue">Transferir</button>
                                    <button class="action-pill action-pill--green">Depositar</button>
                                </div>
                            </div>
                            <div class="account-meta">
                                <div class="account-meta-item">
                                    <span class="meta-label">Apertura</span>
                                    <span class="meta-value">{{ new Date(acc.fecha_apertura).toLocaleDateString('es-CO')
                                        }}</span>
                                </div>
                                <div class="account-meta-item">
                                    <span class="meta-label">Tipo</span>
                                    <span class="meta-value">{{ acc.tipo_cuenta.charAt(0).toUpperCase() +
                                        acc.tipo_cuenta.slice(1) }}</span>
                                </div>
                                <div class="account-meta-item">
                                    <span class="meta-label">Estado</span>
                                    <span class="meta-value"
                                        :style="{ color: acc.estado === 'activa' ? '#28A745' : '#dc3545' }">
                                        {{ acc.estado.charAt(0).toUpperCase() + acc.estado.slice(1) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <!-- MODAL CREAR CUENTA -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                    <div class="modal-box">
                        <div class="modal-header">
                            <h3 class="modal-title">🏦 Crear nueva cuenta</h3>
                            <button class="modal-close" @click="showModal = false">✕</button>
                        </div>
                        <div class="modal-body">
                            <Transition name="fade">
                                <div v-if="createError" class="alert alert--error">❌ {{ createError }}</div>
                            </Transition>
                            <Transition name="fade">
                                <div v-if="createSuccess" class="alert alert--success">✅ {{ createSuccess }}</div>
                            </Transition>

                            <p class="modal-info">Elige el tipo de cuenta que deseas abrir. El número de cuenta se
                                generará automáticamente.</p>

                            <div class="account-type-selector">
                                <div class="type-option" :class="{ selected: newAccount.tipo_cuenta === 'ahorros' }"
                                    @click="newAccount.tipo_cuenta = 'ahorros'">
                                    <div class="type-icon">💰</div>
                                    <div class="type-info">
                                        <div class="type-name">Cuenta de Ahorros</div>
                                        <div class="type-desc">Sin cuota de manejo, rendimientos anuales</div>
                                    </div>
                                    <div class="type-check" v-if="newAccount.tipo_cuenta === 'ahorros'">✅</div>
                                </div>
                                <div class="type-option" :class="{ selected: newAccount.tipo_cuenta === 'corriente' }"
                                    @click="newAccount.tipo_cuenta = 'corriente'">
                                    <div class="type-icon">🏢</div>
                                    <div class="type-info">
                                        <div class="type-name">Cuenta Corriente</div>
                                        <div class="type-desc">Para empresas y alto movimiento</div>
                                    </div>
                                    <div class="type-check" v-if="newAccount.tipo_cuenta === 'corriente'">✅</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-outline-sm" @click="showModal = false">Cancelar</button>
                            <button class="btn-primary" :disabled="creating" @click="handleCreateAccount">
                                <span v-if="creating" class="spinner"></span>
                                <span v-else>Crear cuenta</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import accountService from '@/services/account.service.js'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const accounts = ref([])
const totalBalance = ref('0')
const loading = ref(true)
const showModal = ref(false)
const creating = ref(false)
const createError = ref('')
const createSuccess = ref('')
const newAccount = ref({ tipo_cuenta: 'ahorros' })

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

const loadAccounts = async () => {
    loading.value = true
    try {
        const res = await accountService.getMyAccounts()
        accounts.value = res.data.accounts
        totalBalance.value = Number(res.data.total).toLocaleString('es-CO')
    } catch (e) {
        console.error('Error cargando cuentas:', e)
    } finally {
        loading.value = false
    }
}

const handleCreateAccount = async () => {
    creating.value = true
    createError.value = ''
    createSuccess.value = ''
    try {
        await accountService.createAccount({ tipo_cuenta: newAccount.value.tipo_cuenta })
        createSuccess.value = '¡Cuenta creada exitosamente!'
        await loadAccounts()
        setTimeout(() => {
            showModal.value = false
            createSuccess.value = ''
            newAccount.value = { tipo_cuenta: 'ahorros' }
        }, 1500)
    } catch (e) {
        createError.value = e.response?.data?.message || 'Error al crear la cuenta'
    } finally {
        creating.value = false
    }
}

onMounted(loadAccounts)

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
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 14px rgba(0, 86, 255, 0.3);
}

.new-payment-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
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

.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
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

.btn-new {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.6rem 1.25rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 14px rgba(0, 86, 255, 0.3);
}

.btn-new svg {
    width: 14px;
    height: 14px;
}

.btn-new:hover {
    transform: translateY(-1px);
}

/* CONTENT */
.content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
}

/* BALANCE HERO */
.balance-hero {
    background: linear-gradient(135deg, #007BFF, #0041a8);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.balance-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.75);
    font-family: 'Inter', sans-serif;
    margin-bottom: 0.5rem;
}

.balance-amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.04em;
    font-family: 'Inter', sans-serif;
}

.balance-sub {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'Inter', sans-serif;
    margin-top: 0.35rem;
}

.balance-icon {
    font-size: 3.5rem;
    opacity: 0.3;
}

/* EMPTY STATE */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e9ecef;
    text-align: center;
}

.empty-icon {
    font-size: 3.5rem;
}

.empty-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.empty-sub {
    font-size: 0.9rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    max-width: 360px;
    line-height: 1.6;
}

.empty-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e9ecef;
    border-top-color: #007BFF;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ACCOUNTS GRID */
.accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.account-card {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
}

.account-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.account-card-top {
    padding: 1.5rem;
}

.account-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
}

.account-type-badge {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    border-radius: 99px;
    font-family: 'Inter', sans-serif;
}

.account-status {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.25rem 0.65rem;
    border-radius: 99px;
    font-family: 'Inter', sans-serif;
}

.status--active {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
}

.status--inactive {
    background: rgba(220, 53, 69, 0.3);
    color: #fff;
}

.account-number {
    font-size: 1rem;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Inter', sans-serif;
    margin-bottom: 0.5rem;
}

.account-holder {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Inter', sans-serif;
}

.account-card-body {
    background: #fff;
    padding: 1.25rem;
}

.account-balance-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.account-balance-label {
    font-size: 0.72rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    margin-bottom: 0.2rem;
}

.account-balance-value {
    font-size: 1.35rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.02em;
    font-family: 'Inter', sans-serif;
}

.account-actions {
    display: flex;
    gap: 0.5rem;
}

.action-pill {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.4rem 0.85rem;
    border-radius: 99px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.15s;
}

.action-pill--blue {
    background: rgba(0, 123, 255, 0.1);
    color: #007BFF;
}

.action-pill--green {
    background: rgba(40, 167, 69, 0.1);
    color: #28A745;
}

.action-pill:hover {
    opacity: 0.8;
}

.account-meta {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
}

.account-meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.meta-label {
    font-size: 0.68rem;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.meta-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    font-family: 'Inter', sans-serif;
}

/* BUTTONS */
.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    padding: 0.85rem 1.75rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 18px rgba(0, 86, 255, 0.3);
}

.btn-primary svg {
    width: 16px;
    height: 16px;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 86, 255, 0.4);
}

.btn-primary:disabled {
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

/* MODAL */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(4px);
}

.modal-box {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
}

.modal-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #6C757D;
    padding: 0.25rem;
    border-radius: 6px;
    transition: background 0.15s;
}

.modal-close:hover {
    background: #f8f9fa;
}

.modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.modal-info {
    font-size: 0.875rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.account-type-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.type-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
}

.type-option:hover {
    border-color: #007BFF;
    background: #f0f7ff;
}

.type-option.selected {
    border-color: #007BFF;
    background: #f0f7ff;
}

.type-icon {
    font-size: 1.75rem;
    flex-shrink: 0;
}

.type-info {
    flex: 1;
}

.type-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.type-desc {
    font-size: 0.78rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    margin-top: 0.2rem;
}

.type-check {
    font-size: 1.1rem;
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

/* TRANSITIONS */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
    transform: scale(0.95) translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.22s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@media (max-width: 768px) {
    .sidebar {
        display: none;
    }

    .dashboard-main {
        margin-left: 0;
    }

    .accounts-grid {
        grid-template-columns: 1fr;
    }

    .balance-amount {
        font-size: 1.75rem;
    }
}
</style>