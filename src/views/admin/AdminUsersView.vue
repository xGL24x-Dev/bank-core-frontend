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

      <div class="admin-badge" v-if="!isCollapsed">
        <span>👑 Panel Admin</span>
      </div>
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
        <h1 class="page-title">Gestión de Usuarios</h1>
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
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-value">{{ users.length }}</div>
              <div class="stat-label">Total usuarios</div>
            </div>
          </div>
          <div class="stat-card stat-card--green">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-value">{{users.filter(u => u.cargo === 'client').length}}</div>
              <div class="stat-label">Clientes</div>
            </div>
          </div>
          <div class="stat-card stat-card--yellow">
            <div class="stat-icon">💼</div>
            <div class="stat-info">
              <div class="stat-value">{{users.filter(u => u.cargo === 'cajero').length}}</div>
              <div class="stat-label">Cajeros</div>
            </div>
          </div>
          <div class="stat-card stat-card--purple">
            <div class="stat-icon">👑</div>
            <div class="stat-info">
              <div class="stat-value">{{users.filter(u => u.cargo === 'admin').length}}</div>
              <div class="stat-label">Administradores</div>
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
            <input v-model="search" class="search-input" placeholder="Buscar usuario..." />
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="empty-state">
          <div class="empty-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>

        <!-- TABLA -->
        <div v-else class="table-wrap">
          <table class="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="table-empty">No se encontraron usuarios</td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user.id_empleado" class="table-row">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-sm">{{ getInitials(user.nombre, user.apellido) }}</div>
                    <div>
                      <div class="user-fullname">{{ user.nombre }} {{ user.apellido }}</div>
                      <div class="user-id">#{{ user.id_empleado }}</div>
                    </div>
                  </div>
                </td>
                <td class="td-email">{{ user.correo }}</td>
                <td>{{ user.documento || '—' }}</td>
                <td>{{ user.telefono || '—' }}</td>
                <td>
                  <span class="role-badge" :class="`role--${user.cargo}`">
                    {{ getRoleLabel(user.cargo) }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn action-btn--edit" @click="openEditModal(user)" title="Cambiar rol">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>

    <!-- MODAL EDITAR ROL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-box">
            <div class="modal-header">
              <h3 class="modal-title">✏️ Cambiar Rol</h3>
              <button class="modal-close" @click="showEditModal = false">✕</button>
            </div>
            <div class="modal-body">
              <Transition name="fade">
                <div v-if="editError" class="alert alert--error">❌ {{ editError }}</div>
              </Transition>
              <Transition name="fade">
                <div v-if="editSuccess" class="alert alert--success">✅ {{ editSuccess }}</div>
              </Transition>

              <div class="edit-user-info" v-if="selectedUser">
                <div class="user-avatar-lg">{{ getInitials(selectedUser.nombre, selectedUser.apellido) }}</div>
                <div>
                  <div class="edit-user-name">{{ selectedUser.nombre }} {{ selectedUser.apellido }}</div>
                  <div class="edit-user-email">{{ selectedUser.correo }}</div>
                </div>
              </div>

              <div class="field">
                <label class="label">Nuevo rol</label>
                <div class="role-selector">
                  <div class="role-opt" :class="{ selected: editForm.cargo === 'client' }"
                    @click="editForm.cargo = 'client'">
                    <span>👤</span>
                    <div>
                      <div class="role-opt-name">Cliente</div>
                      <div class="role-opt-desc">Acceso básico a la cuenta</div>
                    </div>
                  </div>
                  <div class="role-opt" :class="{ selected: editForm.cargo === 'cajero' }"
                    @click="editForm.cargo = 'cajero'">
                    <span>💼</span>
                    <div>
                      <div class="role-opt-name">Cajero</div>
                      <div class="role-opt-desc">Acceso a transacciones</div>
                    </div>
                  </div>
                  <div class="role-opt" :class="{ selected: editForm.cargo === 'admin' }"
                    @click="editForm.cargo = 'admin'">
                    <span>👑</span>
                    <div>
                      <div class="role-opt-name">Administrador</div>
                      <div class="role-opt-desc">Acceso total al sistema</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-outline-sm" @click="showEditModal = false">Cancelar</button>
              <button class="btn-primary" :disabled="saving" @click="handleSaveRole">
                <span v-if="saving" class="spinner"></span>
                <span v-else>Guardar cambios</span>
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
import api from '@/services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const users = ref([])
const loading = ref(true)
const activeFilter = ref('todos')
const search = ref('')
const showEditModal = ref(false)
const selectedUser = ref(null)
const saving = ref(false)
const editError = ref('')
const editSuccess = ref('')
const editForm = ref({ cargo: 'client' })

const userInitials = computed(() => {
  const name = authStore.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const getInitials = (nombre, apellido) =>
  `${(nombre || '')[0] || ''}${(apellido || '')[0] || ''}`.toUpperCase()

const getRoleLabel = (cargo) => ({
  admin: 'Administrador',
  cajero: 'Cajero',
  client: 'Cliente',
}[cargo] || cargo)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Clientes', value: 'client' },
  { label: 'Cajeros', value: 'cajero' },
  { label: 'Administradores', value: 'admin' },
]

const filteredUsers = computed(() => {
  let list = users.value
  if (activeFilter.value !== 'todos') {
    list = list.filter(u => u.cargo === activeFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(u =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q)
    )
  }
  return list
})

const openEditModal = (user) => {
  selectedUser.value = user
  editForm.value.cargo = user.cargo
  editError.value = ''
  editSuccess.value = ''
  showEditModal.value = true
}

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    users.value = res.data.data
  } catch (e) {
    console.error('Error usuarios:', e)
  } finally {
    loading.value = false
  }
}

const handleSaveRole = async () => {
  editError.value = ''
  editSuccess.value = ''
  saving.value = true
  try {
    await api.patch(`/users/${selectedUser.value.id_empleado}/role`, { cargo: editForm.value.cargo })
    editSuccess.value = 'Rol actualizado correctamente'
    await loadUsers()
    setTimeout(() => { showEditModal.value = false }, 1500)
  } catch (e) {
    editError.value = e.response?.data?.message || 'Error al actualizar el rol'
  } finally {
    saving.value = false
  }
}

onMounted(loadUsers)

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { path: '/admin/users', label: 'Usuarios', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
  { path: '/admin/audit', label: 'Auditoría', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
  { path: '/accounts', label: 'Cuentas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.users-table thead tr {
  background: #f8faff;
}

.users-table th {
  padding: 0.85rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e9ecef;
}

.users-table td {
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

.table-empty {
  text-align: center;
  color: #9ca3af;
  padding: 2.5rem;
  font-size: 0.9rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-sm {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #007BFF, #0041a8);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-fullname {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
}

.user-id {
  font-size: 0.72rem;
  color: #9ca3af;
}

.td-email {
  font-size: 0.82rem;
  color: #6C757D;
}

.role-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
}

.role--admin {
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
}

.role--cajero {
  background: rgba(255, 193, 7, 0.15);
  color: #d97706;
}

.role--client {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.action-btn--edit {
  background: rgba(0, 123, 255, 0.1);
  color: #007BFF;
}

.action-btn--edit:hover {
  background: rgba(0, 123, 255, 0.2);
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

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #1a202c, #2d3748);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.75rem;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
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
  max-width: 460px;
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

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.edit-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8faff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.user-avatar-lg {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #007BFF, #0041a8);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
}

.edit-user-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.edit-user-email {
  font-size: 0.78rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.role-opt {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 1.2rem;
}

.role-opt:hover {
  border-color: #1a202c;
  background: #f8faff;
}

.role-opt.selected {
  border-color: #1a202c;
  background: #1a202c;
}

.role-opt.selected .role-opt-name {
  color: #fff;
}

.role-opt.selected .role-opt-desc {
  color: rgba(255, 255, 255, 0.6);
}

.role-opt-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.role-opt-desc {
  font-size: 0.72rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
}

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