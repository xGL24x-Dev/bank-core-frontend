<template>
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
        <div class="sidebar-header">
            <img v-if="!isCollapsed" src="@/assets/nexofin_logo.png" alt="NexoFin" class="sidebar-logo" />
            <button class="sidebar-toggle" @click="isCollapsed = !isCollapsed">
                {{ isCollapsed ? '→' : '←' }}
            </button>
        </div>

        <div class="sidebar-user" v-if="!isCollapsed">
            <div class="user-avatar">{{ userInitials }}</div>
            <div class="user-info">
                <div class="user-name">{{ authStore.user?.name || 'Usuario' }}</div>
                <div class="user-role">{{ authStore.user?.role || 'client' }}</div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="sidebar-link"
                :title="item.label">
                <span class="sidebar-link__icon">{{ item.icon }}</span>
                <span class="sidebar-link__label" v-if="!isCollapsed">{{ item.label }}</span>
            </router-link>

            <div class="sidebar-divider"></div>

            <router-link v-if="authStore.isAdmin" to="/admin/users" class="sidebar-link" title="Usuarios">
                <span class="sidebar-link__icon">👥</span>
                <span class="sidebar-link__label" v-if="!isCollapsed">Gestión Usuarios</span>
            </router-link>

            <router-link v-if="authStore.isAdmin" to="/admin/audit" class="sidebar-link" title="Auditoría">
                <span class="sidebar-link__icon">📋</span>
                <span class="sidebar-link__label" v-if="!isCollapsed">Auditoría</span>
            </router-link>
        </nav>

        <div class="sidebar-footer">
            <button class="sidebar-logout" @click="handleLogout" :title="isCollapsed ? 'Cerrar sesión' : ''">
                <span>🚪</span>
                <span v-if="!isCollapsed">Cerrar sesión</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const userInitials = computed(() => {
    const name = authStore.user?.name || 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/accounts', icon: '💳', label: 'Mis Cuentas' },
    { path: '/transactions', icon: '⚡', label: 'Transacciones' },
    { path: '/loans', icon: '🏦', label: 'Préstamos' },
]

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.sidebar {
    width: 260px;
    min-height: 100vh;
    background: #1a202c;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0;
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
    padding: 0 1.25rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-logo {
    height: 36px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
}

.sidebar-toggle {
    background: rgba(255, 255, 255, 0.06);
    border: none;
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    flex-shrink: 0;
}

.sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.12);
}

.sidebar-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #007BFF, #0041a8);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
}

.user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    font-family: 'Inter', sans-serif;
}

.user-role {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: capitalize;
    font-family: 'Inter', sans-serif;
}

.sidebar-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, color 0.15s;
}

.sidebar-link:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
}

.sidebar-link.router-link-active {
    background: rgba(0, 123, 255, 0.15);
    color: #fff;
}

.sidebar-link__icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    width: 20px;
    text-align: center;
}

.sidebar-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0.5rem 0;
}

.sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-logout {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.sidebar-logout:hover {
    background: rgba(220, 53, 69, 0.15);
    color: #fc8181;
}
</style>