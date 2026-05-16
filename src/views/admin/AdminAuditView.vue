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

      <div class="admin-badge" v-if="!isCollapsed"><span>👑 Panel Admin</span></div>
      <div class="admin-badge admin-badge--sm" v-else>👑</div>

      <nav class="sidebar-nav">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="sidebar-link"
          :class="{ active: $route.path === item.path }" :title="item.label">
          <span class="sidebar-link__icon" v-html="item.icon"></span>
          <span class="sidebar-link__label" v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/profile" class="sidebar-profile" :class="{ 'sidebar-profile--collapsed': isCollapsed }">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-info" v-if="!isCollapsed">
            <div class="user-name">{{ authStore.user?.name || 'Admin' }}</div>
            <div class="user-role">Administrador</div>
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
        <h1 class="page-title">Auditoría del Sistema</h1>
        <div class="topbar-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="topbar-avatar-icon">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{{ authStore.user?.name }}</span>
        </div>
      </header>

      <div class="content">

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card stat-card--blue">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <div class="stat-value">{{ auditLogs.length }}</div>
              <div class="stat-label">Total registros</div>
            </div>
          </div>
          <div class="stat-card stat-card--green">
            <div class="stat-icon">🔐</div>
            <div class="stat-info">
              <div class="stat-value">{{auditLogs.filter(l => l.accion === 'login').length}}</div>
              <div class="stat-label">Inicios de sesión</div>
            </div>
          </div>
          <div class="stat-card stat-card--yellow">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <div class="stat-value">{{auditLogs.filter(l => l.accion === 'register').length}}</div>
              <div class="stat-label">Registros</div>
            </div>
          </div>
          <div class="stat-card stat-card--purple">
            <div class="stat-icon">⚡</div>
            <div class="stat-info">
              <div class="stat-value">{{auditLogs.filter(l => l.accion === 'transaction').length}}</div>
              <div class="stat-label">Transacciones</div>
            </div>
          </div>
        </div>

        <!-- FILTROS -->
        <div class="filters-bar">
          <div class="filter-tabs">
            <button v-for="f in filters" :key="f.value" class="filter-tab" :class="{ active: activeFilter === f.value }"
              @click="activeFilter = f.value">
              {{ f.label }}
            </button>
          </div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="search" class="search-input" placeholder="Buscar en auditoría..." />
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="empty-state">
          <div class="empty-spinner"></div>
          <p>Cargando registros...</p>
        </div>

        <!-- SIN REGISTROS -->
        <div v-else-if="filteredLogs.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3 class="empty-title">No hay registros de auditoría</h3>
          <p class="empty-sub">Los eventos del sistema aparecerán aquí automáticamente.</p>
        </div>

        <!-- TABLA -->
        <div v-else class="table-wrap">
          <table class="audit-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id_auditoria" class="table-row">
                <td class="td-id">#{{ log.id_auditoria }}</td>
                <td>
                  <div class="user-cell">
                    <div class="user-dot" :style="{ background: getUserColor(log.id_empleado) }">
                      {{ log.id_empleado }}
                    </div>
                    <span class="td-user">Usuario #{{ log.id_empleado }}</span>
                  </div>
                </td>
                <td>
                  <span class="action-badge" :class="`action--${log.accion}`">
                    {{ getActionIcon(log.accion) }} {{ getActionLabel(log.accion) }}
                  </span>
                </td>
                <td class="td-detail">{{ log.detalle || '—' }}</td>
                <td class="td-date">
                  {{ new Date(log.fecha).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  }) }}
                </td>
              </tr>
            </tbody>
          </table>
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

const auditLogs = ref([])
const loading = ref(true)
const activeFilter = ref('todos')
const search = ref('')

const userInitials = computed(() => {
  const name = authStore.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Login', value: 'login' },
  { label: 'Registro', value: 'register' },
  { label: 'Transacciones', value: 'transaction' },
  { label: 'Cambios', value: 'update' },
]

const getActionLabel = (accion) => ({
  login: 'Inicio sesión',
  logout: 'Cierre sesión',
  register: 'Registro',
  transaction: 'Transacción',
  update: 'Actualización',
  delete: 'Eliminación',
}[accion] || accion)

const getActionIcon = (accion) => ({
  login: '🔐',
  logout: '🚪',
  register: '👤',
  transaction: '⚡',
  update: '✏️',
  delete: '🗑️',
}[accion] || '📋')

const getUserColor = (id) => {
  const colors = ['#007BFF', '#28A745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14']
  return colors[id % colors.length]
}

const filteredLogs = computed(() => {
  let list = auditLogs.value
  if (activeFilter.value !== 'todos') {
    list = list.filter(l => l.accion === activeFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(l =>
      (l.detalle || '').toLowerCase().includes(q) ||
      l.accion.toLowerCase().includes(q)
    )
  }
  return list
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/audit')
    auditLogs.value = res.data.data
  } catch (e) {
    console.error('Error auditoría:', e)
    auditLogs.value = []
  } finally {
    loading.value = false
  }
})

// ✅ CORREGIDO: todos los links apuntan a rutas /admin/
const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { path: '/admin/users', label: 'Usuarios', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
  { path: '/admin/accounts', label: 'Cuentas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
  { path: '/admin/audit', label: 'Auditoría', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
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

.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #1a202c;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1rem;
}

.sidebar-logo {
  height: 34px;
  width: auto;
  max-width: 130px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-toggle svg {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
}

.admin-badge {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 193, 7, 0.2);
  font-family: 'Inter', sans-serif;
}

.admin-badge--sm {
  font-size: 1rem;
  padding: 0.4rem;
  text-align: center;
  margin-bottom: 1rem;
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
  color: rgba(255, 255, 255, 0.55);
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
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.sidebar-link.active {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  font-weight: 600;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-profile:hover {
  background: rgba(255, 255, 255, 0.06);
}

.sidebar-profile--collapsed {
  justify-content: center;
  padding: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffc107, #e65c00);
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
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.user-role {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.45);
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
  color: rgba(255, 255, 255, 0.45);
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
  background: rgba(220, 53, 69, 0.15);
  color: #fc8181;
}

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

.content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.75rem;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card--blue .stat-icon {
  background: rgba(0, 123, 255, 0.1);
}

.stat-card--green .stat-icon {
  background: rgba(40, 167, 69, 0.1);
}

.stat-card--yellow .stat-icon {
  background: rgba(255, 193, 7, 0.1);
}

.stat-card--purple .stat-icon {
  background: rgba(111, 66, 193, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.stat-label {
  font-size: 0.72rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  margin-top: 0.15rem;
}

.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 500;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.filter-tab:hover {
  background: #f0f7ff;
  color: #007BFF;
}

.filter-tab.active {
  background: #1a202c;
  color: #fff;
  font-weight: 700;
}

.filter-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  border: 1px solid #e9ecef;
}

.filter-search svg {
  width: 14px;
  height: 14px;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  color: #1a202c;
  width: 200px;
}

.search-input::placeholder {
  color: #9ca3af;
}

.table-wrap {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.audit-table thead tr {
  background: #f8faff;
}

.audit-table th {
  padding: 0.85rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e9ecef;
}

.audit-table td {
  padding: 0.9rem 1.25rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child td {
  border-bottom: none;
}

.table-row:hover td {
  background: #f8faff;
}

.td-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-dot {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.td-user {
  font-size: 0.82rem;
  color: #374151;
}

.action-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.action--login {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.action--logout {
  background: rgba(108, 117, 125, 0.1);
  color: #6C757D;
}

.action--register {
  background: rgba(0, 123, 255, 0.1);
  color: #007BFF;
}

.action--transaction {
  background: rgba(255, 193, 7, 0.15);
  color: #d97706;
}

.action--update {
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
}

.action--delete {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.td-detail {
  font-size: 0.82rem;
  color: #6C757D;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.td-date {
  font-size: 0.78rem;
  color: #9ca3af;
  white-space: nowrap;
}

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

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .dashboard-main {
    margin-left: 0;
  }
}
</style>