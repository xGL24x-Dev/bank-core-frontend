import api from './api.js'

export const authService = {
    /**
     * POST /auth/login
     * Espera: { email, password }
     * Retorna: { token, user }
     */
    async login(credentials) {
        const res = await api.post('/auth/login', credentials)
        return res.data
    },

    /**
     * POST /auth/register
     * Espera: { name, email, password, ... }
     * Retorna: { token?, user }
     */
    async register(payload) {
        const res = await api.post('/auth/register', payload)
        return res.data
    },

    /**
     * POST /auth/logout  (invalida el token en el backend)
     */
    async logout() {
        const res = await api.post('/auth/logout')
        return res.data
    },

    /**
     * GET /auth/me  (obtiene el usuario autenticado)
     */
    async me() {
        const res = await api.get('/auth/me')
        return res.data
    },
}

export default authService
