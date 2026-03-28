<template>
  <div class="page">
    <h1>Dashboard</h1>
    <!-- TODO: Implementar vista principal del dashboard -->
    <p>Bienvenido, {{ authStore.user?.name }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()
</script>

<style scoped>
.page { padding: 2rem; color: #eee; font-family: 'Nunito', sans-serif; }
</style>
