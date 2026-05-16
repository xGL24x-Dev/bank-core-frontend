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
        <h1 class="page-title">Dashboard Administrativo</h1>
        <div class="topbar-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="topbar-avatar-icon">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{{ authStore.user?.name }}</span>
        </div>
      </header>

      <div class="content">

        <!-- MÉTRICAS GLOBALES -->
        <div class="metrics-grid">
          <div class="metric-card" v-for="m in globalMetrics" :key="m.label"
            :style="{ borderTop: `3px solid ${m.color}` }">
            <div class="metric-icon" :style="{ background: m.bg }">{{ m.icon }}</div>
            <div class="metric-info">
              <div class="metric-value" v-if="!loading">{{ m.value }}</div>
              <div class="skeleton-value" v-else></div>
              <div class="metric-label">{{ m.label }}</div>
            </div>
            <div class="metric-trend" :style="{ color: m.color }">{{ m.trend }}</div>
          </div>
        </div>

        <!-- FILA 2: Gráfica + Préstamos pendientes -->
        <div class="row-grid">

          <!-- GRÁFICA TRANSACCIONES -->
          <div class="chart-card">
            <div class="card-header">
              <h3 class="card-title">📊 Transacciones por Mes</h3>
              <div class="chart-legend">
                <span class="legend-item legend-item--blue">● Depósitos</span>
                <span class="legend-item legend-item--red">● Retiros</span>
              </div>
            </div>
            <div class="chart-body">
              <div v-if="loading" class="chart-skeleton"></div>
              <div v-else class="bar-chart">
                <div class="bar-group" v-for="(month, i) in chartData" :key="i">
                  <div class="bars">
                    <div class="bar bar--blue" :style="{ height: getBarHeight(month.depositos) + '%' }"
                      :title="`Depósitos: $${month.depositos.toLocaleString('es-CO')}`"></div>
                    <div class="bar bar--red" :style="{ height: getBarHeight(month.retiros) + '%' }"
                      :title="`Retiros: $${month.retiros.toLocaleString('es-CO')}`"></div>
                  </div>
                  <div class="bar-label">{{ month.mes }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- PRÉSTAMOS PENDIENTES -->
          <div class="loans-card">
            <div class="card-header">
              <h3 class="card-title">⏳ Préstamos Pendientes</h3>
              <span class="pending-count">{{ pendingLoans.length }}</span>
            </div>
            <div class="loans-list">
              <div v-if="loading" class="skeleton-list">
                <div class="skeleton-item" v-for="i in 3" :key="i"></div>
              </div>
              <div v-else-if="pendingLoans.length === 0" class="no-pending">
                ✅ No hay préstamos pendientes
              </div>
              <div v-else class="loan-item" v-for="loan in pendingLoans" :key="loan.id_prestamo">
                <div class="loan-item-info">
                  <div class="loan-item-amount">$ {{ Number(loan.monto).toLocaleString('es-CO') }}</div>
                  <div class="loan-item-meta">{{ loan.cuotas }} cuotas · {{ loan.interes }}% · Cliente #{{
                    loan.id_cliente }}</div>
                  <div class="loan-item-date">{{ new Date(loan.fecha).toLocaleDateString('es-CO') }}</div>
                </div>
                <div class="loan-item-actions">
                  <button class="action-approve" @click="handleLoanAction(loan.id_prestamo, 'aprobado')"
                    :disabled="processingLoan === loan.id_prestamo">
                    <span v-if="processingLoan === loan.id_prestamo">...</span>
                    <span v-else>✅ Aprobar</span>
                  </button>
                  <button class="action-reject" @click="handleLoanAction(loan.id_prestamo, 'rechazado')"
                    :disabled="processingLoan === loan.id_prestamo">
                    <span v-if="processingLoan === loan.id_prestamo">...</span>
                    <span v-else>❌ Rechazar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- FILA 3: Últimos usuarios + Últimas transacciones -->
        <div class="row-grid">

          <!-- ÚLTIMOS USUARIOS -->
          <div class="table-card">
            <div class="card-header">
              <h3 class="card-title">👥 Últimos Usuarios Registrados</h3>
              <router-link to="/admin/users" class="card-link">Ver todos →</router-link>
            </div>
            <div v-if="loading" class="skeleton-list">
              <div class="skeleton-item" v-for="i in 4" :key="i"></div>
            </div>
            <table v-else class="mini-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in recentUsers" :key="user.id_empleado">
                  <td>
                    <div class="mini-user">
                      <div class="mini-avatar">{{ user.nombre[0] }}{{ user.apellido[0] }}</div>
                      {{ user.nombre }} {{ user.apellido }}
                    </div>
                  </td>
                  <td class="td-sm">{{ user.correo }}</td>
                  <td><span class="role-badge" :class="`role--${user.cargo}`">{{ getRoleLabel(user.cargo) }}</span></td>
                </tr>
                <tr v-if="recentUsers.length === 0">
                  <td colspan="3" class="td-empty">Sin usuarios</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ÚLTIMAS TRANSACCIONES GLOBALES -->
          <div class="table-card">
            <div class="card-header">
              <h3 class="card-title">⚡ Últimas Transacciones</h3>
              <router-link to="/admin/audit" class="card-link">Ver auditoría →</router-link>
            </div>
            <div v-if="loading" class="skeleton-list">
              <div class="skeleton-item" v-for="i in 4" :key="i"></div>
            </div>
            <table v-else class="mini-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in recentTransactions" :key="tx.id_transaccion">
                  <td>
                    <span class="tx-badge" :class="`tx--${tx.tipo}`">
                      {{ getTxIcon(tx.tipo) }} {{ tx.tipo }}
                    </span>
                  </td>
                  <td :class="tx.tipo === 'deposito' ? 'amount-green' : 'amount-red'">
                    $ {{ Number(tx.monto).toLocaleString('es-CO') }}
                  </td>
                  <td class="td-sm">{{ new Date(tx.fecha).toLocaleDateString('es-CO') }}</td>
                </tr>
                <tr v-if="recentTransactions.length === 0">
                  <td colspan="3" class="td-empty">Sin transacciones</td>
                </tr>
              </tbody>
            </table>
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
const loading = ref(true)
const processingLoan = ref(null)

const stats = ref({ users: 0, accounts: 0, transactions: 0, loans: 0, totalBalance: 0, pendingLoans: 0 })
const recentUsers = ref([])
const recentTransactions = ref([])
const pendingLoans = ref([])
const chartData = ref([])

const userInitials = computed(() => {
  const name = authStore.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const getRoleLabel = (cargo) => ({ admin: 'Admin', cajero: 'Cajero', client: 'Cliente' }[cargo] || cargo)
const getTxIcon = (tipo) => ({ deposito: '💰', retiro: '💸', transferencia: '⚡' }[tipo] || '💳')

const maxBar = computed(() => {
  if (!chartData.value.length) return 1
  return Math.max(...chartData.value.map(m => Math.max(m.depositos, m.retiros)), 1)
})

const getBarHeight = (value) => Math.max((value / maxBar.value) * 100, 2)

const globalMetrics = computed(() => [
  { icon: '👥', label: 'Total usuarios', value: stats.value.users, trend: '↑', color: '#007BFF', bg: 'rgba(0,123,255,0.1)' },
  { icon: '💳', label: 'Cuentas activas', value: stats.value.accounts, trend: '↑', color: '#28A745', bg: 'rgba(40,167,69,0.1)' },
  { icon: '⚡', label: 'Total transacciones', value: stats.value.transactions, trend: '↑', color: '#ffc107', bg: 'rgba(255,193,7,0.1)' },
  { icon: '🏦', label: 'Préstamos pendientes', value: stats.value.pendingLoans, trend: '⏳', color: '#dc3545', bg: 'rgba(220,53,69,0.1)' },
  { icon: '💰', label: 'Saldo total sistema', value: '$' + Number(stats.value.totalBalance).toLocaleString('es-CO'), trend: '↑', color: '#28A745', bg: 'rgba(40,167,69,0.1)' },
  { icon: '📋', label: 'Total préstamos', value: stats.value.loans, trend: '↑', color: '#6f42c1', bg: 'rgba(111,66,193,0.1)' },
])

const handleLoanAction = async (loanId, estado) => {
  processingLoan.value = loanId
  try {
    await api.patch(`/loans/${loanId}/status`, { estado })
    pendingLoans.value = pendingLoans.value.filter(l => l.id_prestamo !== loanId)
    stats.value.pendingLoans--
  } catch (e) {
    console.error('Error actualizando préstamo:', e)
  } finally {
    processingLoan.value = null
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [usersRes, loansRes] = await Promise.all([
      api.get('/users'),
      api.get('/loans/all').catch(() => ({ data: { data: [] } })),
    ])

    const users = usersRes.data.data || []
    const loans = loansRes.data.data || []

    recentUsers.value = users.slice(0, 5)
    pendingLoans.value = loans.filter(l => l.estado === 'pendiente')

    stats.value = {
      users: users.length,
      accounts: 0,
      transactions: 0,
      loans: loans.length,
      totalBalance: 0,
      pendingLoans: loans.filter(l => l.estado === 'pendiente').length,
    }

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    chartData.value = meses.map(mes => ({
      mes,
      depositos: Math.floor(Math.random() * 5000000) + 500000,
      retiros: Math.floor(Math.random() * 3000000) + 200000,
    }))

  } catch (e) {
    console.error('Error cargando datos admin:', e)
  } finally {
    loading.value = false
  }
})

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { path: '/admin/users', label: 'Usuarios', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' },
  { path: '/admin/accounts', label: 'Cuentas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
  { path: '/admin/audit', label: 'Auditoría', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { path: '/dashboard', label: 'Vista User', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' },
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
  transition: margin-left 0.25s;
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.metric-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.1rem;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon {
  font-size: 1.5rem;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 0.65rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  margin-top: 0.1rem;
}

.metric-trend {
  font-size: 1rem;
  flex-shrink: 0;
}

.skeleton-value {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 60px;
  margin-bottom: 4px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.row-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
}

.chart-card,
.loans-card,
.table-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem 0.75rem;
  border-bottom: 1px solid #f5f5f5;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.card-link {
  font-size: 0.78rem;
  color: #007BFF;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.card-link:hover {
  text-decoration: underline;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.legend-item--blue {
  color: #007BFF;
}

.legend-item--red {
  color: #dc3545;
}

.chart-body {
  padding: 1.5rem;
}

.chart-skeleton {
  height: 160px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  height: 160px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  height: 100%;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  flex: 1;
  width: 100%;
}

.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  min-height: 4px;
}

.bar:hover {
  opacity: 0.8;
}

.bar--blue {
  background: linear-gradient(180deg, #007BFF, #0041a8);
}

.bar--red {
  background: linear-gradient(180deg, #dc3545, #a71d2a);
}

.bar-label {
  font-size: 0.68rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.pending-count {
  background: #dc3545;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

.loans-list {
  padding: 0.5rem 0;
  max-height: 320px;
  overflow-y: auto;
}

.no-pending {
  padding: 2rem;
  text-align: center;
  color: #28A745;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
}

.loan-item {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.loan-item:last-child {
  border-bottom: none;
}

.loan-item-amount {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.loan-item-meta {
  font-size: 0.72rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  margin: 0.2rem 0;
}

.loan-item-date {
  font-size: 0.68rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.loan-item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-shrink: 0;
}

.action-approve,
.action-reject {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}

.action-approve {
  background: rgba(40, 167, 69, 0.12);
  color: #28A745;
}

.action-approve:hover {
  background: rgba(40, 167, 69, 0.2);
}

.action-reject {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.action-reject:hover {
  background: rgba(220, 53, 69, 0.2);
}

.action-approve:disabled,
.action-reject:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.mini-table th {
  padding: 0.65rem 1.25rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e9ecef;
  background: #f8faff;
}

.mini-table td {
  padding: 0.75rem 1.25rem;
  font-size: 0.82rem;
  color: #374151;
  border-bottom: 1px solid #f5f5f5;
}

.mini-table tr:last-child td {
  border-bottom: none;
}

.mini-table tr:hover td {
  background: #f8faff;
}

.mini-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-avatar {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #007BFF, #0041a8);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
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

.tx-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

.tx--deposito {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.tx--retiro {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.tx--transferencia {
  background: rgba(0, 123, 255, 0.1);
  color: #007BFF;
}

.amount-green {
  color: #28A745;
  font-weight: 700;
}

.amount-red {
  color: #dc3545;
  font-weight: 700;
}

.td-sm {
  font-size: 0.75rem;
  color: #6C757D;
}

.td-empty {
  text-align: center;
  color: #9ca3af;
  padding: 1.5rem;
  font-size: 0.82rem;
}

.skeleton-list {
  padding: 0.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-item {
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 10px;
}

@media (max-width: 1400px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .row-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .dashboard-main {
    margin-left: 0;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>