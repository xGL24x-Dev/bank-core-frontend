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
                <router-link to="/profile" class="sidebar-profile"
                    :class="{ 'sidebar-profile--collapsed': isCollapsed }">
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
                <div class="topbar-left">
                    <div class="tab-buttons">
                        <button class="tab-btn" :class="{ active: activeTab === 'accounts' }"
                            @click="activeTab = 'accounts'">
                            💳 Cuentas
                        </button>
                        <button class="tab-btn" :class="{ active: activeTab === 'loans' }" @click="activeTab = 'loans'">
                            🏦 Préstamos
                            <span v-if="pendingLoansCount > 0" class="tab-badge">{{ pendingLoansCount }}</span>
                        </button>
                        <button class="tab-btn" :class="{ active: activeTab === 'transactions' }"
                            @click="activeTab = 'transactions'">
                            ⚡ Transacciones
                        </button>
                    </div>
                </div>
                <div class="topbar-user">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                        class="topbar-avatar-icon">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{{ authStore.user?.name }}</span>
                </div>
            </header>

            <div class="content">

                <!-- ── TAB: CUENTAS ── -->
                <div v-if="activeTab === 'accounts'">
                    <div class="stats-grid">
                        <div class="stat-card stat-card--blue">
                            <div class="stat-icon">💳</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ accounts.length }}</div>
                                <div class="stat-label">Total cuentas</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--green">
                            <div class="stat-icon">💰</div>
                            <div class="stat-info">
                                <div class="stat-value">${{ totalSaldo }}</div>
                                <div class="stat-label">Saldo total sistema</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--yellow">
                            <div class="stat-icon">🏦</div>
                            <div class="stat-info">
                                <div class="stat-value">{{accounts.filter(a => a.tipo_cuenta === 'ahorros').length}}
                                </div>
                                <div class="stat-label">Cuentas de ahorros</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--purple">
                            <div class="stat-icon">🏢</div>
                            <div class="stat-info">
                                <div class="stat-value">{{accounts.filter(a => a.tipo_cuenta === 'corriente').length}}
                                </div>
                                <div class="stat-label">Cuentas corrientes</div>
                            </div>
                        </div>
                    </div>

                    <div class="filters-bar">
                        <div class="filter-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input v-model="searchAccount" class="search-input"
                                placeholder="Buscar por número o titular..." />
                        </div>
                    </div>

                    <div v-if="loadingAccounts" class="empty-state">
                        <div class="empty-spinner"></div>
                        <p>Cargando cuentas...</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Cuenta</th>
                                    <th>Titular</th>
                                    <th>Tipo</th>
                                    <th>Saldo</th>
                                    <th>Estado</th>
                                    <th>Apertura</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="filteredAccounts.length === 0">
                                    <td colspan="7" class="td-empty">No hay cuentas registradas</td>
                                </tr>
                                <tr v-for="acc in filteredAccounts" :key="acc.id_cuenta" class="table-row">
                                    <td class="td-mono">{{ acc.numero_cuenta }}</td>
                                    <td>
                                        <div class="user-cell">
                                            <div class="mini-avatar">{{ acc.nombre ? acc.nombre[0] : '?' }}</div>
                                            {{ acc.nombre }} {{ acc.apellido }}
                                        </div>
                                    </td>
                                    <td><span class="type-badge"
                                            :class="acc.tipo_cuenta === 'ahorros' ? 'badge--green' : 'badge--blue'">{{
                                            acc.tipo_cuenta }}</span></td>
                                    <td class="td-amount">$ {{ Number(acc.saldo).toLocaleString('es-CO') }}</td>
                                    <td><span class="status-badge"
                                            :class="acc.estado === 'activa' ? 'status--active' : 'status--inactive'">{{
                                            acc.estado }}</span></td>
                                    <td class="td-sm">{{ new Date(acc.fecha_apertura).toLocaleDateString('es-CO') }}
                                    </td>
                                    <td>
                                        <button class="action-btn action-btn--green" @click="openSaldoModal(acc)"
                                            title="Agregar saldo">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── TAB: PRÉSTAMOS ── -->
                <div v-if="activeTab === 'loans'">
                    <div class="filters-bar">
                        <div class="filter-tabs">
                            <button v-for="f in loanFilters" :key="f.value" class="filter-tab"
                                :class="{ active: activeLoanFilter === f.value }" @click="activeLoanFilter = f.value">{{
                                f.label }}</button>
                        </div>
                    </div>

                    <div v-if="loadingLoans" class="empty-state">
                        <div class="empty-spinner"></div>
                        <p>Cargando préstamos...</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cliente</th>
                                    <th>Monto</th>
                                    <th>Cuotas</th>
                                    <th>Interés</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="filteredLoans.length === 0">
                                    <td colspan="8" class="td-empty">No hay préstamos</td>
                                </tr>
                                <tr v-for="loan in filteredLoans" :key="loan.id_prestamo" class="table-row">
                                    <td class="td-sm">#{{ loan.id_prestamo }}</td>
                                    <td class="td-sm">Cliente #{{ loan.id_cliente }}</td>
                                    <td class="td-amount">$ {{ Number(loan.monto).toLocaleString('es-CO') }}</td>
                                    <td class="td-sm">{{ loan.cuotas }} meses</td>
                                    <td class="td-sm">{{ loan.interes }}%</td>
                                    <td>
                                        <span class="status-badge" :class="`loan-status--${loan.estado}`">
                                            {{ getLoanLabel(loan.estado) }}
                                        </span>
                                    </td>
                                    <td class="td-sm">{{ new Date(loan.fecha).toLocaleDateString('es-CO') }}</td>
                                    <td>
                                        <div class="actions-row" v-if="loan.estado === 'pendiente'">
                                            <button class="action-btn action-btn--green"
                                                @click="handleLoanAction(loan.id_prestamo, 'aprobado')"
                                                :disabled="processingLoan === loan.id_prestamo" title="Aprobar">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </button>
                                            <button class="action-btn action-btn--red"
                                                @click="handleLoanAction(loan.id_prestamo, 'rechazado')"
                                                :disabled="processingLoan === loan.id_prestamo" title="Rechazar">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                        <span v-else class="td-sm" style="color:#9ca3af">—</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ── TAB: TRANSACCIONES ── -->
                <div v-if="activeTab === 'transactions'">
                    <div class="stats-grid">
                        <div class="stat-card stat-card--blue">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ allTransactions.length }}</div>
                                <div class="stat-label">Total transacciones</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--green">
                            <div class="stat-icon">📈</div>
                            <div class="stat-info">
                                <div class="stat-value">${{ totalDepositos }}</div>
                                <div class="stat-label">Total depósitos</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--red">
                            <div class="stat-icon">📉</div>
                            <div class="stat-info">
                                <div class="stat-value">${{ totalRetiros }}</div>
                                <div class="stat-label">Total retiros</div>
                            </div>
                        </div>
                        <div class="stat-card stat-card--yellow">
                            <div class="stat-icon">🔄</div>
                            <div class="stat-info">
                                <div class="stat-value">{{allTransactions.filter(t => t.tipo ===
                                    'transferencia').length }}</div>
                                <div class="stat-label">Transferencias</div>
                            </div>
                        </div>
                    </div>

                    <div class="filters-bar">
                        <div class="filter-tabs">
                            <button v-for="f in txFilters" :key="f.value" class="filter-tab"
                                :class="{ active: activeTxFilter === f.value }" @click="activeTxFilter = f.value">{{
                                f.label }}</button>
                        </div>
                        <div class="filter-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input v-model="searchTx" class="search-input" placeholder="Buscar transacción..." />
                        </div>
                    </div>

                    <div v-if="loadingTx" class="empty-state">
                        <div class="empty-spinner"></div>
                        <p>Cargando transacciones...</p>
                    </div>
                    <div v-else class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cuenta</th>
                                    <th>Tipo</th>
                                    <th>Monto</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="filteredTransactions.length === 0">
                                    <td colspan="6" class="td-empty">No hay transacciones</td>
                                </tr>
                                <tr v-for="tx in filteredTransactions" :key="tx.id_transaccion" class="table-row">
                                    <td class="td-sm">#{{ tx.id_transaccion }}</td>
                                    <td class="td-mono td-sm">{{ tx.numero_cuenta || `#${tx.id_cuenta}` }}</td>
                                    <td>
                                        <span class="tx-badge" :class="`tx--${tx.tipo}`">
                                            {{ getTxIcon(tx.tipo) }} {{ tx.tipo }}
                                        </span>
                                    </td>
                                    <td :class="tx.tipo === 'deposito' ? 'amount-green' : 'amount-red'">
                                        {{ tx.tipo === 'deposito' ? '+' : '-' }} $ {{
                                            Number(tx.monto).toLocaleString('es-CO') }}
                                    </td>
                                    <td class="td-sm">{{ tx.descripcion || '—' }}</td>
                                    <td class="td-sm">{{ new Date(tx.fecha).toLocaleDateString('es-CO', {
                                        day:
                                            '2-digit', month: 'short', year: 'numeric' }) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>

        <!-- MODAL AGREGAR SALDO -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showSaldoModal" class="modal-overlay" @click.self="showSaldoModal = false">
                    <div class="modal-box">
                        <div class="modal-header">
                            <h3 class="modal-title">💰 Agregar Saldo</h3>
                            <button class="modal-close" @click="showSaldoModal = false">✕</button>
                        </div>
                        <div class="modal-body" v-if="selectedAccount">
                            <div class="account-info-box">
                                <div class="aib-row">
                                    <span class="aib-label">Número de cuenta</span>
                                    <span class="aib-value">{{ selectedAccount.numero_cuenta }}</span>
                                </div>
                                <div class="aib-row">
                                    <span class="aib-label">Titular</span>
                                    <span class="aib-value">{{ selectedAccount.nombre }} {{ selectedAccount.apellido
                                        }}</span>
                                </div>
                                <div class="aib-row">
                                    <span class="aib-label">Saldo actual</span>
                                    <span class="aib-value aib-value--green">$ {{
                                        Number(selectedAccount.saldo).toLocaleString('es-CO') }}</span>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Monto a acreditar (COP)</label>
                                <div class="input-prefix-wrap">
                                    <span class="input-prefix">$</span>
                                    <input v-model="saldoForm.monto" type="number" class="input input--prefix"
                                        placeholder="0" min="1000" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Descripción <span class="label-opt">(opcional)</span></label>
                                <input v-model="saldoForm.descripcion" class="input"
                                    placeholder="Ej: Depósito administrativo..." />
                            </div>

                            <div class="preview-saldo" v-if="saldoForm.monto">
                                <span>Nuevo saldo:</span>
                                <strong>$ {{ (Number(selectedAccount.saldo) +
                                    Number(saldoForm.monto)).toLocaleString('es-CO') }}</strong>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-outline-sm" @click="showSaldoModal = false">Cancelar</button>
                            <button class="btn-primary" :disabled="addingSaldo" @click="handleAddSaldo">
                                <span v-if="addingSaldo" class="spinner"></span>
                                <span v-else>Acreditar saldo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <AppToast />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import AppToast from '@/components/common/AppToast.vue'
import api from '@/services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const isCollapsed = ref(false)

const activeTab = ref('accounts')
const accounts = ref([])
const allLoans = ref([])
const allTransactions = ref([])
const loadingAccounts = ref(true)
const loadingLoans = ref(true)
const loadingTx = ref(true)
const searchAccount = ref('')
const searchTx = ref('')
const activeLoanFilter = ref('todos')
const activeTxFilter = ref('todos')
const processingLoan = ref(null)

const showSaldoModal = ref(false)
const selectedAccount = ref(null)
const addingSaldo = ref(false)
const saldoForm = ref({ monto: '', descripcion: '' })

const userInitials = computed(() => {
    const name = authStore.user?.name || 'A'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => { authStore.logout(); router.push('/login') }

const pendingLoansCount = computed(() => allLoans.value.filter(l => l.estado === 'pendiente').length)

const totalSaldo = computed(() =>
    accounts.value.reduce((sum, a) => sum + Number(a.saldo), 0).toLocaleString('es-CO')
)
const totalDepositos = computed(() =>
    allTransactions.value.filter(t => t.tipo === 'deposito').reduce((sum, t) => sum + Number(t.monto), 0).toLocaleString('es-CO')
)
const totalRetiros = computed(() =>
    allTransactions.value.filter(t => t.tipo !== 'deposito').reduce((sum, t) => sum + Number(t.monto), 0).toLocaleString('es-CO')
)

const filteredAccounts = computed(() => {
    if (!searchAccount.value.trim()) return accounts.value
    const q = searchAccount.value.toLowerCase()
    return accounts.value.filter(a =>
        a.numero_cuenta.toLowerCase().includes(q) ||
        `${a.nombre} ${a.apellido}`.toLowerCase().includes(q)
    )
})

const loanFilters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Aprobados', value: 'aprobado' },
    { label: 'Rechazados', value: 'rechazado' },
]

const filteredLoans = computed(() => {
    if (activeLoanFilter.value === 'todos') return allLoans.value
    return allLoans.value.filter(l => l.estado === activeLoanFilter.value)
})

const txFilters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Depósitos', value: 'deposito' },
    { label: 'Retiros', value: 'retiro' },
    { label: 'Transferencias', value: 'transferencia' },
]

const filteredTransactions = computed(() => {
    let list = allTransactions.value
    if (activeTxFilter.value !== 'todos') list = list.filter(t => t.tipo === activeTxFilter.value)
    if (searchTx.value.trim()) {
        const q = searchTx.value.toLowerCase()
        list = list.filter(t => (t.descripcion || '').toLowerCase().includes(q) || t.tipo.toLowerCase().includes(q))
    }
    return list
})

const getLoanLabel = (estado) => ({ pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado', pagado: 'Pagado' }[estado] || estado)
const getTxIcon = (tipo) => ({ deposito: '💰', retiro: '💸', transferencia: '⚡' }[tipo] || '💳')

const openSaldoModal = (account) => {
    selectedAccount.value = account
    saldoForm.value = { monto: '', descripcion: '' }
    showSaldoModal.value = true
}

const handleAddSaldo = async () => {
    if (!saldoForm.value.monto || Number(saldoForm.value.monto) < 1000) {
        toast.warning('El monto mínimo es $1.000')
        return
    }
    addingSaldo.value = true
    try {
        await api.post('/admin/accounts/add-saldo', {
            id_cuenta: selectedAccount.value.id_cuenta,
            monto: Number(saldoForm.value.monto),
            descripcion: saldoForm.value.descripcion || 'Depósito administrativo',
        })
        toast.success(`✅ Saldo acreditado correctamente`)
        showSaldoModal.value = false
        await loadAccounts()
    } catch (e) {
        toast.error(e.response?.data?.message || 'Error al acreditar el saldo')
    } finally {
        addingSaldo.value = false
    }
}

const handleLoanAction = async (loanId, estado) => {
    processingLoan.value = loanId
    try {
        await api.patch(`/loans/${loanId}/status`, { estado })
        const loan = allLoans.value.find(l => l.id_prestamo === loanId)
        if (loan) loan.estado = estado
        toast.success(estado === 'aprobado' ? '✅ Préstamo aprobado' : '❌ Préstamo rechazado')
        if (estado === 'aprobado') await loadAccounts()
    } catch (e) {
        toast.error('Error al actualizar el préstamo')
    } finally {
        processingLoan.value = null
    }
}

const loadAccounts = async () => {
    loadingAccounts.value = true
    try {
        const res = await api.get('/admin/accounts')
        accounts.value = res.data.data
    } catch (e) {
        toast.error('Error al cargar las cuentas')
    } finally {
        loadingAccounts.value = false
    }
}

const loadLoans = async () => {
    loadingLoans.value = true
    try {
        const res = await api.get('/loans/all')
        allLoans.value = res.data.data
    } catch (e) {
        toast.error('Error al cargar los préstamos')
    } finally {
        loadingLoans.value = false
    }
}

const loadTransactions = async () => {
    loadingTx.value = true
    try {
        const res = await api.get('/admin/transactions')
        allTransactions.value = res.data.data
    } catch (e) {
        toast.error('Error al cargar las transacciones')
    } finally {
        loadingTx.value = false
    }
}

onMounted(() => {
    loadAccounts()
    loadLoans()
    loadTransactions()
})

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
    padding: 0.75rem 2rem;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 40;
    gap: 1rem;
}

.topbar-left {
    display: flex;
    align-items: center;
}

.tab-buttons {
    display: flex;
    gap: 0.35rem;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.1rem;
    border-radius: 10px;
    border: 1.5px solid #e9ecef;
    background: transparent;
    font-size: 0.85rem;
    font-weight: 600;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
}

.tab-btn:hover {
    border-color: #ffc107;
    color: #1a202c;
    background: rgba(255, 193, 7, 0.05);
}

.tab-btn.active {
    background: #1a202c;
    color: #fff;
    border-color: #1a202c;
}

.tab-badge {
    background: #dc3545;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 0.1rem 0.4rem;
    border-radius: 99px;
    margin-left: 0.25rem;
}

.topbar-user {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    font-family: 'Inter', sans-serif;
    flex-shrink: 0;
}

.topbar-avatar-icon {
    width: 28px;
    height: 28px;
    color: #6C757D;
}

.content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

.stat-card--red .stat-icon {
    background: rgba(220, 53, 69, 0.1);
}

.stat-value {
    font-size: 1.25rem;
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
    background: rgba(255, 193, 7, 0.1);
    color: #1a202c;
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
    width: 220px;
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

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter', sans-serif;
}

.data-table thead tr {
    background: #f8faff;
}

.data-table th {
    padding: 0.85rem 1.25rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: #6C757D;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e9ecef;
}

.data-table td {
    padding: 0.85rem 1.25rem;
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

.td-empty {
    text-align: center;
    color: #9ca3af;
    padding: 2.5rem;
    font-size: 0.9rem;
}

.td-sm {
    font-size: 0.78rem;
    color: #6C757D;
}

.td-mono {
    font-family: monospace;
    font-size: 0.82rem;
}

.td-amount {
    font-weight: 700;
    color: #1a202c;
}

.amount-green {
    color: #28A745;
    font-weight: 700;
}

.amount-red {
    color: #dc3545;
    font-weight: 700;
}

.user-cell {
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

.type-badge,
.status-badge,
.tx-badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
}

.badge--green {
    background: rgba(40, 167, 69, 0.1);
    color: #28A745;
}

.badge--blue {
    background: rgba(0, 123, 255, 0.1);
    color: #007BFF;
}

.status-badge.status--active {
    background: rgba(40, 167, 69, 0.1);
    color: #28A745;
}

.status-badge.status--inactive {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.loan-status--pendiente {
    background: rgba(255, 193, 7, 0.15);
    color: #d97706;
}

.loan-status--aprobado {
    background: rgba(40, 167, 69, 0.12);
    color: #28A745;
}

.loan-status--rechazado {
    background: rgba(220, 53, 69, 0.12);
    color: #dc3545;
}

.loan-status--pagado {
    background: rgba(0, 123, 255, 0.1);
    color: #007BFF;
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

.actions-row {
    display: flex;
    gap: 0.4rem;
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

.action-btn--green {
    background: rgba(40, 167, 69, 0.12);
    color: #28A745;
}

.action-btn--green:hover {
    background: rgba(40, 167, 69, 0.25);
}

.action-btn--red {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.action-btn--red:hover {
    background: rgba(220, 53, 69, 0.2);
}

.action-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
    border-top-color: #1a202c;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
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
    gap: 1.1rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.account-info-box {
    background: #f8faff;
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.aib-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.aib-label {
    font-size: 0.78rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
}

.aib-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.aib-value--green {
    color: #28A745;
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
    width: 100%;
}

.input:focus {
    border-color: #1a202c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26, 32, 44, 0.08);
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

.preview-saldo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(40, 167, 69, 0.08);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(40, 167, 69, 0.2);
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    color: #374151;
}

.preview-saldo strong {
    color: #28A745;
    font-size: 1rem;
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
}
</style>