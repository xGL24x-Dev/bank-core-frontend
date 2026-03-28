import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
    { path: '/', redirect: '/login' },

    // ── Auth (públicas) ──────────────────────────────────
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

    // ── Privadas (requieren JWT) ─────────────────────────
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
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

    // ── Solo Admin ───────────────────────────────────────
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
        path: '/admin/audit',
        name: 'AdminAudit',
        component: () => import('@/views/admin/AdminAuditView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },

    // ── 404 ─────────────────────────────────────────────
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
        return next('/dashboard')
    }

    next()
})

export default router
