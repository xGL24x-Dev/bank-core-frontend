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

      <button class="new-payment-btn" :class="{ 'new-payment-btn--collapsed': isCollapsed }" @click="showModal = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span v-if="!isCollapsed">Nueva Transacción</span>
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
        <h1 class="page-title">Transacciones</h1>
        <div class="topbar-right">
          <div class="topbar-user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="topbar-avatar-icon">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{{ authStore.user?.name || 'Usuario' }}</span>
          </div>
          <button class="btn-new" @click="showModal = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva Transacción
          </button>
        </div>
      </header>

      <div class="content">

        <!-- SIN CUENTA -->
        <div v-if="!loadingAccount && !account" class="empty-state">
          <div class="empty-icon">💳</div>
          <h3 class="empty-title">No tienes una cuenta bancaria</h3>
          <p class="empty-sub">Para hacer transacciones primero debes crear tu cuenta bancaria.</p>
          <router-link to="/accounts" class="btn-primary">🏦 Crear cuenta bancaria</router-link>
        </div>

        <template v-else>

          <!-- RESUMEN -->
          <div class="stats-grid">
            <div class="stat-card stat-card--blue">
              <div class="stat-icon">💳</div>
              <div class="stat-info">
                <div class="stat-value">$ {{ saldoActual }}</div>
                <div class="stat-label">Saldo disponible</div>
              </div>
            </div>
            <div class="stat-card stat-card--green">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <div class="stat-value">$ {{ totalIngresos }}</div>
                <div class="stat-label">Total ingresos</div>
              </div>
            </div>
            <div class="stat-card stat-card--red">
              <div class="stat-icon">📉</div>
              <div class="stat-info">
                <div class="stat-value">$ {{ totalEgresos }}</div>
                <div class="stat-label">Total egresos</div>
              </div>
            </div>
            <div class="stat-card stat-card--gray">
              <div class="stat-icon">🔢</div>
              <div class="stat-info">
                <div class="stat-value">{{ transactions.length }}</div>
                <div class="stat-label">Total movimientos</div>
              </div>
            </div>
          </div>

          <!-- FILTROS -->
          <div class="filters-bar">
            <div class="filter-tabs">
              <button v-for="f in filters" :key="f.value" class="filter-tab"
                :class="{ active: activeFilter === f.value }" @click="activeFilter = f.value">
                {{ f.label }}
              </button>
            </div>
            <div class="filter-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input v-model="search" class="search-input" placeholder="Buscar transacción..." />
            </div>
          </div>

          <!-- LOADING -->
          <div v-if="loading" class="empty-state">
            <div class="empty-spinner"></div>
            <p>Cargando transacciones...</p>
          </div>

          <!-- SIN TRANSACCIONES -->
          <div v-else-if="filteredTransactions.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3 class="empty-title">No hay transacciones</h3>
            <p class="empty-sub">Realiza tu primera transacción para verla aquí.</p>
            <button class="btn-primary" @click="showModal = true">
              Nueva transacción
            </button>
          </div>

          <!-- LISTA -->
          <div v-else class="transactions-list">
            <div class="tx-card" v-for="tx in filteredTransactions" :key="tx.id_transaccion">
              <div class="tx-icon-wrap" :class="`tx-icon-wrap--${tx.tipo}`">
                <span>{{ getTxIcon(tx.tipo) }}</span>
              </div>
              <div class="tx-details">
                <div class="tx-name">{{ tx.descripcion || getTxLabel(tx.tipo) }}</div>
                <div class="tx-meta">
                  <span class="tx-type-badge" :class="`badge--${tx.tipo}`">{{ getTxLabel(tx.tipo) }}</span>
                  <span class="tx-date">{{ new Date(tx.fecha).toLocaleDateString('es-CO', {
                    day: '2-digit', month:
                      'short', year: 'numeric' }) }}</span>
                </div>
              </div>
              <div class="tx-amount-wrap">
                <div class="tx-amount" :class="tx.tipo === 'deposito' ? 'amount--credit' : 'amount--debit'">
                  {{ tx.tipo === 'deposito' ? '+' : '-' }} $ {{ Number(tx.monto).toLocaleString('es-CO') }}
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
    </main>

    <!-- MODAL NUEVA TRANSACCIÓN -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-box">
            <div class="modal-header">
              <h3 class="modal-title">⚡ Nueva Transacción</h3>
              <button class="modal-close" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <Transition name="fade">
                <div v-if="txError" class="alert alert--error">❌ {{ txError }}</div>
              </Transition>
              <Transition name="fade">
                <div v-if="txSuccess" class="alert alert--success">✅ {{ txSuccess }}</div>
              </Transition>

              <!-- TIPO -->
              <div class="field">
                <label class="label">Tipo de transacción</label>
                <div class="type-selector">
                  <div class="type-opt" :class="{ selected: newTx.tipo === 'deposito' }"
                    @click="newTx.tipo = 'deposito'">
                    <span>💰</span> Depósito
                  </div>
                  <div class="type-opt" :class="{ selected: newTx.tipo === 'retiro' }" @click="newTx.tipo = 'retiro'">
                    <span>💸</span> Retiro
                  </div>
                  <div class="type-opt" :class="{ selected: newTx.tipo === 'transferencia' }"
                    @click="newTx.tipo = 'transferencia'">
                    <span>⚡</span> Transferencia
                  </div>
                </div>
              </div>

              <!-- MONTO -->
              <div class="field">
                <label class="label">Monto (COP)</label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix">$</span>
                  <input v-model="newTx.monto" type="number" class="input input--prefix" placeholder="0" min="1" />
                </div>
              </div>

              <!-- DESCRIPCIÓN -->
              <div class="field">
                <label class="label">Descripción <span class="label-opt">(opcional)</span></label>
                <input v-model="newTx.descripcion" class="input" placeholder="Ej: Pago de servicios, nómina..." />
              </div>

              <!-- SALDO DISPONIBLE -->
              <div class="saldo-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Saldo disponible: <strong>$ {{ saldoActual }}</strong>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-outline-sm" @click="closeModal">Cancelar</button>
              <button class="btn-primary" :disabled="creating" @click="handleCreateTx">
                <span v-if="creating" class="spinner"></span>
                <span v-else>Realizar transacción</span>
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
import transactionService from '@/services/transaction.service.js'

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const transactions = ref([])
const account = ref(null)
const loading = ref(true)
const loadingAccount = ref(true)
const showModal = ref(false)
const creating = ref(false)
const txError = ref('')
const txSuccess = ref('')
const activeFilter = ref('todos')
const search = ref('')

const newTx = ref({ tipo: 'deposito', monto: '', descripcion: '' })

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

const saldoActual = computed(() => {
  if (!account.value) return '0'
  return Number(account.value.saldo).toLocaleString('es-CO')
})

const totalIngresos = computed(() => {
  const total = transactions.value
    .filter(t => t.tipo === 'deposito')
    .reduce((sum, t) => sum + Number(t.monto), 0)
  return total.toLocaleString('es-CO')
})

const totalEgresos = computed(() => {
  const total = transactions.value
    .filter(t => t.tipo !== 'deposito')
    .reduce((sum, t) => sum + Number(t.monto), 0)
  return total.toLocaleString('es-CO')
})

const filteredTransactions = computed(() => {
  let list = transactions.value
  if (activeFilter.value !== 'todos') {
    list = list.filter(t => t.tipo === activeFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(t =>
      (t.descripcion || '').toLowerCase().includes(q) ||
      t.tipo.toLowerCase().includes(q)
    )
  }
  return list
})

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Depósitos', value: 'deposito' },
  { label: 'Retiros', value: 'retiro' },
  { label: 'Transferencias', value: 'transferencia' },
]

const getTxIcon = (tipo) => ({ deposito: '💰', retiro: '💸', transferencia: '⚡' }[tipo] || '💳')
const getTxLabel = (tipo) => ({ deposito: 'Depósito', retiro: 'Retiro', transferencia: 'Transferencia' }[tipo] || tipo)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const closeModal = () => {
  showModal.value = false
  txError.value = ''
  txSuccess.value = ''
  newTx.value = { tipo: 'deposito', monto: '', descripcion: '' }
}

const loadData = async () => {
  try {
    const accRes = await accountService.getMyAccounts()
    account.value = accRes.data.accounts[0] || null
  } catch (e) {
    console.error('Error cuenta:', e)
  } finally {
    loadingAccount.value = false
  }

  if (!account.value) { loading.value = false; return }

  try {
    const txRes = await transactionService.getMyTransactions(50)
    transactions.value = txRes.data
  } catch (e) {
    console.error('Error transacciones:', e)
  } finally {
    loading.value = false
  }
}

const handleCreateTx = async () => {
  txError.value = ''
  txSuccess.value = ''

  if (!newTx.value.monto || Number(newTx.value.monto) <= 0) {
    txError.value = 'Ingresa un monto válido'
    return
  }

  if (!account.value) {
    txError.value = 'No tienes cuenta bancaria'
    return
  }

  creating.value = true
  try {
    await transactionService.createTransaction({
      id_cuenta: account.value.id_cuenta,
      tipo: newTx.value.tipo,
      monto: Number(newTx.value.monto),
      descripcion: newTx.value.descripcion,
    })
    txSuccess.value = '¡Transacción realizada exitosamente!'
    await loadData()
    setTimeout(closeModal, 1500)
  } catch (e) {
    txError.value = e.response?.data?.message || 'Error al realizar la transacción'
  } finally {
    creating.value = false
  }
}

onMounted(loadData)

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

/* STATS */
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

.stat-card--red .stat-icon {
  background: rgba(220, 53, 69, 0.1);
}

.stat-card--gray .stat-icon {
  background: rgba(108, 117, 125, 0.1);
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.72rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  margin-top: 0.15rem;
}

/* FILTERS */
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
  background: #007BFF;
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
  width: 180px;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* TRANSACTIONS LIST */
.transactions-list {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tx-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}

.tx-card:last-child {
  border-bottom: none;
}

.tx-card:hover {
  background: #f8faff;
}

.tx-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.tx-icon-wrap--deposito {
  background: rgba(40, 167, 69, 0.1);
}

.tx-icon-wrap--retiro {
  background: rgba(220, 53, 69, 0.1);
}

.tx-icon-wrap--transferencia {
  background: rgba(0, 123, 255, 0.1);
}

.tx-details {
  flex: 1;
}

.tx-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.25rem;
}

.tx-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tx-type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-family: 'Inter', sans-serif;
}

.badge--deposito {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.badge--retiro {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.badge--transferencia {
  background: rgba(0, 123, 255, 0.1);
  color: #007BFF;
}

.tx-date {
  font-size: 0.72rem;
  color: #9ca3af;
  font-family: 'Inter', sans-serif;
}

.tx-amount {
  font-size: 1rem;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
}

.amount--credit {
  color: #28A745;
}

.amount--debit {
  color: #dc3545;
}

/* EMPTY */
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
  text-decoration: none;
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
  gap: 1.1rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.label-opt {
  font-weight: 400;
  color: #9ca3af;
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

.input-prefix-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #6C757D;
  pointer-events: none;
}

.input--prefix {
  padding-left: 2rem;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
}

.type-opt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.7rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: #6C757D;
  transition: all 0.15s;
}

.type-opt:hover {
  border-color: #007BFF;
  color: #007BFF;
  background: #f0f7ff;
}

.type-opt.selected {
  border-color: #007BFF;
  background: #007BFF;
  color: #fff;
}

.saldo-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  background: #f8faff;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
}

.saldo-info svg {
  width: 16px;
  height: 16px;
  color: #007BFF;
  flex-shrink: 0;
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

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }
}
</style>