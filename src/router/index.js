import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes = [

  // ── Públicas ─────────────────────────────────────────
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },

  // ── Privadas (requieren JWT) ──────────────────────────
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/views/accounts/AccountsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/loans',
    name: 'Loans',
    component: () => import('@/views/loans/LoansView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/transactions/TransactionsView.vue'),
    meta: { requiresAuth: true },
  },

  // ── Solo Admin ────────────────────────────────────────
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/AdminUsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('@/views/admin/AdminAccountsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/audit',
    name: 'AdminAudit',
    component: () => import('@/views/admin/AdminAuditView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
  path: '/admin/login',
  name: 'AdminLogin',
  component: () => import('@/views/admin/AdminLoginView.vue'),
  meta: { guest: true },
},
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: () => import('@/views/admin/AdminRegisterView.vue'),
    meta: { guest: true },
  },

  // ── 404 ──────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/dashboard')
  }
  if (to.meta.guest && auth.isAuthenticated) {
    if (auth.isAdmin) return next('/admin/dashboard')
    return next('/dashboard')
  }

  next()
})

export default router