<template>
  <div class="admin-shell">
    <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-brand">
        <router-link to="/admin/dashboard" class="brand-link" :title="isCollapsed ? 'NexoFin Admin' : ''">
          <div class="brand-mark">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="url(#brandGrad)" />
              <path d="M12 28V16l8-5 8 5v12" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
              <path d="M16 28v-6h8v6" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
              <circle cx="20" cy="14" r="2" fill="#7dd3fc" />
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stop-color="#0ea5e9" />
                  <stop offset="1" stop-color="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div v-if="!isCollapsed" class="brand-text">
            <span class="brand-name">NexoFin</span>
            <span class="brand-tag">Command Center</span>
          </div>
        </router-link>
        <button type="button" class="collapse-btn" @click="isCollapsed = !isCollapsed" aria-label="Menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!isCollapsed" d="M15 18l-6-6 6-6" />
            <path v-else d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div v-if="!isCollapsed" class="sidebar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input type="search" placeholder="Buscar en el panel..." disabled />
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          :title="item.label"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          <span v-if="!isCollapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <div class="sidebar-quick" v-if="!isCollapsed">
        <p class="quick-title">Acciones rápidas</p>
        <router-link to="/admin/accounts" class="quick-btn">💳 Gestionar cuentas</router-link>
        <router-link to="/admin/users" class="quick-btn">👥 Ver usuarios</router-link>
      </div>

      <div class="sidebar-footer">
        <div class="admin-user" :class="{ compact: isCollapsed }">
          <div class="admin-user-avatar">{{ initials }}</div>
          <div v-if="!isCollapsed" class="admin-user-info">
            <span class="admin-user-name">{{ authStore.user?.name || 'Admin' }}</span>
            <span class="admin-user-role">Super administrador</span>
          </div>
        </div>
        <button type="button" class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span v-if="!isCollapsed">Salir</span>
        </button>
      </div>
    </aside>

    <div class="admin-main" :class="{ expanded: isCollapsed }">
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="page-subtitle">{{ pageSubtitle }}</p>
        </div>
        <div class="topbar-right">
          <div class="system-pill">
            <span class="pulse-dot"></span>
            Sistema en línea
          </div>
          <span class="topbar-date">{{ today }}</span>
          <div class="topbar-avatar">{{ initials }}</div>
        </div>
      </header>

      <div class="admin-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import adminService from '@/services/admin.service.js'

defineProps({
  pageTitle: { type: String, default: 'Panel Admin' },
  pageSubtitle: { type: String, default: '' },
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const pendingLoans = ref(0)

const initials = computed(() => {
  const name = authStore.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const today = computed(() =>
  new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
)

const navItems = computed(() => [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  },
  {
    path: '/admin/users',
    label: 'Usuarios',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  },
  {
    path: '/admin/accounts',
    label: 'Cuentas y préstamos',
    badge: pendingLoans.value || null,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  },
  {
    path: '/admin/audit',
    label: 'Auditoría',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>',
  },
  {
    path: '/dashboard',
    label: 'Vista cliente',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  },
])

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(async () => {
  try {
    const res = await adminService.getStats()
    pendingLoans.value = res.data?.loans?.pendiente || 0
  } catch {
    pendingLoans.value = 0
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.admin-shell {
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  background: #0b1220;
}

.admin-sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #0c1222 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.12);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  transition: width 0.25s ease;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  min-width: 0;
}

.brand-mark {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.4));
}

.brand-mark svg {
  width: 44px;
  height: 44px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.brand-tag {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #38bdf8;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.collapse-btn svg {
  width: 16px;
  height: 16px;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  margin-bottom: 1.25rem;
}

.sidebar-search svg {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.sidebar-search input {
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 0.8rem;
  width: 100%;
  outline: none;
}

.sidebar-search input::placeholder {
  color: #64748b;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  text-decoration: none;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
  position: relative;
}

.nav-item:hover {
  background: rgba(56, 189, 248, 0.08);
  color: #e2e8f0;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.1));
  color: #38bdf8;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #0ea5e9;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  min-width: 20px;
  text-align: center;
}

.sidebar-quick {
  margin: 1rem 0;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.quick-title {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.quick-btn {
  display: block;
  font-size: 0.78rem;
  color: #cbd5e1;
  text-decoration: none;
  padding: 0.4rem 0;
  transition: color 0.15s;
}

.quick-btn:hover {
  color: #38bdf8;
}

.sidebar-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem;
}

.admin-user.compact {
  justify-content: center;
}

.admin-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-user-name {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
}

.admin-user-role {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: none;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.admin-main {
  margin-left: 280px;
  flex: 1;
  min-height: 100vh;
  background: #f1f5f9;
  transition: margin-left 0.25s ease;
}

.admin-main.expanded {
  margin-left: 80px;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.15rem;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.system-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  border: 1px solid #bbf7d0;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

.topbar-date {
  font-size: 0.8rem;
  color: #64748b;
  text-transform: capitalize;
}

.topbar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-content {
  padding: 1.5rem 2rem 2.5rem;
}

@media (max-width: 900px) {
  .admin-sidebar {
    display: none;
  }
  .admin-main,
  .admin-main.expanded {
    margin-left: 0;
  }
  .topbar-date {
    display: none;
  }
}
</style>
