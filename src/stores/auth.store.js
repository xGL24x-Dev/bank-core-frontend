import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import authService from '@/services/auth.service.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: (() => {
      try {
        const u = localStorage.getItem('user')
        return u ? JSON.parse(u) : null
      } catch { return null }
    })(),
    loading: false,
    error:   null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
    isAdmin:         (s) => s.user?.role === 'admin',
  },

  actions: {
    setSession(token, user) {
      this.token = token
      this.user  = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearError() {
      this.error = null
    },

    async login(credentials) {
      this.loading = true
      this.error   = null
      try {
        const data = await authService.login(credentials)
        this.setSession(data.data.token, data.data.user)
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        this.loading = false
      }
    },

    async register(payload) {
      this.loading = true
      this.error   = null
      try {
        await authService.register(payload)
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al registrarse'
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user  = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})