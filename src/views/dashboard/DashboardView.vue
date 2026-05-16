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
        <router-link to="/profile" class="sidebar-profile" :class="{ 'sidebar-profile--collapsed': isCollapsed }">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-info" v-if="!isCollapsed">
            <div class="user-name">{{ authStore.user?.name || 'Usuario' }}</div>
            <div class="user-role">
              {{ authStore.user?.role === 'admin' ? 'Administrador' : authStore.user?.role === 'cajero' ? 'Cajero' :
              'Cliente' }}
            </div>
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
        <h1 class="page-title">Inicio</h1>
        <div class="topbar-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="topbar-avatar-icon">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Bienvenido, {{ firstName }}</span>
        </div>
      </header>

      <div class="content">

        <!-- BANNER BIENVENIDA SIN CUENTAS -->
        <div v-if="!loadingAccounts && accounts.length === 0" class="welcome-banner">
          <div class="welcome-content">
            <div class="welcome-icon">👋</div>
            <div class="welcome-text">
              <h2 class="welcome-title">¡Bienvenido, {{ firstName }}!</h2>
              <p class="welcome-sub">Para comenzar a usar NexoFin necesitas crear tu primera cuenta bancaria.</p>
            </div>
            <router-link to="/accounts" class="btn-welcome">
              🏦 Crear mi primera cuenta
            </router-link>
          </div>
        </div>

        <!-- SALDO TOTAL (solo si tiene cuentas) -->
        <div v-else class="balance-hero">
          <div class="balance-amount">
            <span v-if="loadingAccounts">Cargando...</span>
            <span v-else>$ {{ totalBalance }}</span>
          </div>
          <div class="balance-label">Saldo Total Disponible</div>
          <div class="balance-actions">
            <button class="action-btn" v-for="action in quickActions" :key="action.label">
              <div class="action-icon" v-html="action.icon"></div>
              <span>{{ action.label }}</span>
            </button>
          </div>
        </div>

        <!-- WIDGETS -->
        <div class="widgets-grid">

          <!-- Actividad Reciente -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Actividad Reciente</h3>
              <router-link to="/transactions" class="widget-link">Ver todo</router-link>
            </div>
            <div class="widget-body">
              <div v-if="loadingTx" class="widget-empty">Cargando...</div>
              <div v-else-if="recentActivity.length === 0" class="widget-empty">No hay transacciones aún</div>
              <TransactionCard v-else v-for="tx in recentActivity" :key="tx.id" :icon="tx.icon" :name="tx.name"
                :date="tx.date" :amount="tx.amount" :type="tx.type" />
            </div>
          </div>

          <!-- Préstamos Activos -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Préstamos Activos</h3>
              <router-link to="/loans" class="widget-link">Ver todo</router-link>
            </div>
            <div class="widget-body widget-body--loans">
              <div v-if="loadingLoans" class="widget-empty">Cargando...</div>
              <div v-else-if="loans.length === 0" class="widget-empty">No hay préstamos activos</div>
              <LoanCard v-else v-for="loan in loans" :key="loan.id" :amount="loan.amount" :cuotas="loan.cuotas"
                :interes="loan.interes" :fecha="loan.fecha" :status="loan.status" :progress="loan.progress" />
            </div>
          </div>

          <!-- Resumen de Cuentas -->
          <div class="widget">
            <div class="widget-header">
              <h3 class="widget-title">Resumen de Cuentas</h3>
              <router-link to="/accounts" class="widget-link">Gestionar</router-link>
            </div>
            <div class="widget-body">
              <div v-if="loadingAccounts" class="widget-empty">Cargando...</div>
              <div v-else-if="accounts.length === 0" class="widget-empty-accounts">
                <div class="widget-empty-icon">🏦</div>
                <p class="widget-empty-text">No tienes cuentas aún</p>
                <router-link to="/accounts" class="widget-empty-btn">Crear cuenta</router-link>
              </div>
              <div v-else class="account-item" v-for="acc in accounts" :key="acc.id_cuenta">
                <div class="account-icon"
                  :style="{ background: acc.tipo_cuenta === 'ahorros' ? 'linear-gradient(135deg,#28A745,#1a7a32)' : 'linear-gradient(135deg,#007BFF,#0041a8)' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div class="account-info">
                  <div class="account-name">{{ acc.tipo_cuenta.charAt(0).toUpperCase() + acc.tipo_cuenta.slice(1) }}
                  </div>
                  <div class="account-date">{{ acc.numero_cuenta }}</div>
                </div>
                <div class="account-balance" :class="acc.saldo >= 0 ? 'amount--credit' : 'amount--debit'">
                  ${{ Number(acc.saldo).toLocaleString('es-CO') }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- MÉTRICAS -->
        <div class="metrics-grid">
          <MetricWidget v-for="m in metrics" :key="m.label" :icon="m.icon" :label="m.label" :value="m.value"
            :change="m.change" :positive="m.positive" :bg="m.bg" />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import MetricWidget from '@/components/dashboard/MetricWidget.vue'
import TransactionCard from '@/components/dashboard/TransactionCard.vue'
import LoanCard from '@/components/dashboard/LoanCard.vue'
import accountService from '@/services/account.service.js'
import transactionService from '@/services/transaction.service.js'
import loanService from '@/services/loan.service.js'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const accounts = ref([])
const recentActivity = ref([])
const loans = ref([])
const totalBalance = ref('0')
const loadingAccounts = ref(true)
const loadingTx = ref(true)
const loadingLoans = ref(true)

const firstName = computed(() => {
  const name = authStore.user?.name || 'Usuario'
  return name.split(' ')[0]
})

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    const accData = await accountService.getMyAccounts()
    accounts.value = accData.data.accounts
    totalBalance.value = Number(accData.data.total).toLocaleString('es-CO')
  } catch (e) {
    console.error('Error cuentas:', e)
  } finally {
    loadingAccounts.value = false
  }

  try {
    const txData = await transactionService.getMyTransactions(4)
    recentActivity.value = txData.data.map(tx => ({
      id: tx.id_transaccion,
      icon: tx.tipo === 'deposito' ? '💰' : tx.tipo === 'prestamo' ? '🏦' : tx.tipo === 'transferencia' ? '⚡' : tx.tipo === 'pago_cuota' ? '📋' : '🛒',
      name: tx.descripcion || tx.tipo,
      date: new Date(tx.fecha).toLocaleDateString('es-CO'),
      amount: Number(tx.monto).toLocaleString('es-CO'),
      type: (tx.tipo === 'deposito' || tx.tipo === 'prestamo') ? 'credit' : 'debit',
    }))
  } catch (e) {
    console.error('Error transacciones:', e)
  } finally {
    loadingTx.value = false
  }

  try {
    const loanData = await loanService.getMyLoans()
    loans.value = loanData.data.map(loan => ({
      id: loan.id_prestamo,
      amount: Number(loan.monto).toLocaleString('es-CO'),
      cuotas: loan.cuotas,
      interes: Number(loan.interes),
      fecha: new Date(loan.fecha).toLocaleDateString('es-CO'),
      status: loan.estado === 'aprobado' ? 'active' : loan.estado === 'pendiente' ? 'pending' : loan.estado === 'pagado' ? 'paid' : loan.estado,
      progress: loan.progreso || 0,
    }))
  } catch (e) {
    console.error('Error préstamos:', e)
  } finally {
    loadingLoans.value = false
  }
})

const menuItems = [
  { path: '/dashboard', label: 'Inicio', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { path: '/accounts', label: 'Cuentas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
  { path: '/transactions', label: 'Pagos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>' },
  { path: '/loans', label: 'Préstamos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  { path: '/settings', label: 'Ajustes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
]

const quickActions = [
  { label: 'Transferir', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>' },
  { label: 'Pagar', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
  { label: 'Solicitar', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>' },
  { label: 'Añadir Fondos', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>' },
]

const metrics = computed(() => [
  { icon: '💳', label: 'Cuentas activas', value: accounts.value.length.toString(), change: '', positive: true, bg: 'rgba(0,123,255,0.1)' },
  { icon: '🏦', label: 'Préstamos activos', value: loans.value.filter(l => l.status === 'active').length.toString(), change: '', positive: true, bg: 'rgba(40,167,69,0.1)' },
  { icon: '⚡', label: 'Transacciones', value: recentActivity.value.length.toString(), change: '', positive: true, bg: 'rgba(255,193,7,0.1)' },
  { icon: '💰', label: 'Saldo total', value: '$' + totalBalance.value, change: '', positive: true, bg: 'rgba(40,167,69,0.1)' },
])
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
  box-shadow: 0 6px 18px rgba(0, 86, 255, 0.4);
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

/* WELCOME BANNER */
.welcome-banner {
  background: linear-gradient(135deg, #007BFF, #0041a8);
  border-radius: 20px;
  padding: 2rem 2.5rem;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.welcome-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.welcome-sub {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.btn-welcome {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: #007BFF;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.75rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-welcome:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* BALANCE HERO */
.balance-hero {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.balance-amount {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  letter-spacing: -0.04em;
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.4rem;
}

.balance-label {
  font-size: 0.9rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
}

.balance-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  transition: color 0.15s;
}

.action-btn:hover {
  color: #007BFF;
}

.action-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
  background: #f8faff;
}

.action-icon :deep(svg) {
  width: 20px;
  height: 20px;
  stroke: #374151;
}

.action-btn:hover .action-icon {
  border-color: #007BFF;
  background: #f0f7ff;
}

.action-btn:hover .action-icon :deep(svg) {
  stroke: #007BFF;
}

/* WIDGETS */
.widgets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.widget {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #f5f5f5;
}

.widget-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.widget-link {
  font-size: 0.78rem;
  color: #007BFF;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.widget-link:hover {
  text-decoration: underline;
}

.widget-body {
  padding: 0.5rem 0;
}

.widget-body--loans {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.widget-empty {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
}

.widget-empty-accounts {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.widget-empty-icon {
  font-size: 2rem;
}

.widget-empty-text {
  font-size: 0.82rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.widget-empty-btn {
  font-size: 0.78rem;
  color: #007BFF;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

/* CUENTAS */
.account-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  transition: background 0.15s;
}

.account-item:hover {
  background: #f8faff;
}

.account-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-icon svg {
  width: 18px;
  height: 18px;
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
}

.account-date {
  font-size: 0.72rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.account-balance {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.amount--credit {
  color: #28A745;
}

.amount--debit {
  color: #dc3545;
}

/* MÉTRICAS */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1200px) {
  .widgets-grid {
    grid-template-columns: 1fr 1fr;
  }

  .metrics-grid {
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

  .widgets-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .balance-amount {
    font-size: 2rem;
  }

  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>