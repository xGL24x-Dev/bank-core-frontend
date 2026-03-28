import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Composable useAuth
 * Encapsula las acciones y estado del store de autenticación
 * para usarlos fácilmente en cualquier componente.
 *
 * Uso:
 *   const { user, isAuthenticated, login, logout } = useAuth()
 */
export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()

    const user = computed(() => authStore.user)
    const token = computed(() => authStore.token)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)
    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)

    async function login(credentials) {
        await authStore.login(credentials)
        if (!authStore.error) {
            router.push('/dashboard')
        }
    }

    async function register(payload) {
        await authStore.register(payload)
        if (!authStore.error) {
            // Si el backend devuelve token: va al dashboard
            // Si no (requiere verificar email): va al login
            authStore.isAuthenticated
                ? router.push('/dashboard')
                : router.push('/login')
        }
    }

    async function logout() {
        try {
            const { authService } = await import('@/services/auth.service.js')
            await authService.logout()
        } catch (_) {
            // Ignorar errores de red al cerrar sesión
        } finally {
            authStore.logout()
            router.push('/login')
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        register,
        logout,
    }
}
