import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (s) => !!s.token,
        isAdmin: (s) => s.user?.role === 'admin',
    },

    actions: {
        // Guarda sesión en estado y localStorage
        setSession(token, user) {
            this.token = token
            this.user = user
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        },

        clearError() {
            this.error = null
        },

        // ── LOGIN ────────────────────────────────────────────
        async login({ email, password }) {
            this.loading = true
            this.error = null
            try {
                const { authService } = await import('@/services/auth.service.js')
                const data = await authService.login({ email, password })
                this.setSession(data.token, data.user)
            } catch (err) {
                this.error = err.response?.data?.message
                    || err.message
                    || 'Credenciales incorrectas'
            } finally {
                this.loading = false
            }
        },

        // ── REGISTER ─────────────────────────────────────────
        async register(payload) {
            this.loading = true
            this.error = null
            try {
                const { authService } = await import('@/services/auth.service.js')
                const data = await authService.register(payload)
                // Si el backend devuelve token al registrar, iniciamos sesión directo
                if (data.token) this.setSession(data.token, data.user)
            } catch (err) {
                this.error = err.response?.data?.message
                    || err.message
                    || 'Error al crear la cuenta'
            } finally {
                this.loading = false
            }
        },

        // ── LOGOUT ───────────────────────────────────────────
        logout() {
            this.token = null
            this.user = null
            this.error = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
    },
})
