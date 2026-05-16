<template>
    <nav class="navbar">
        <div class="nav-brand">
            <router-link to="/">
                <img src="@/assets/nexofin_logo.png" alt="NexoFin" class="nav-logo" />
            </router-link>
        </div>
        <div class="nav-links">
            <a href="#servicios" class="nav-link">Servicios</a>
            <a href="#seguridad" class="nav-link">Seguridad</a>
            <a href="#contacto" class="nav-link">Contacto</a>
            <router-link to="/login" class="btn-login">Iniciar sesión</router-link>
            <router-link to="/register" class="btn-register">Crear cuenta</router-link>
        </div>
    </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 4rem;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 123, 255, 0.08);
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
}

.nav-logo {
    height: 42px;
    width: auto;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-link {
    color: #6C757D;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
}

.nav-link:hover {
    color: #007BFF;
}

.btn-login {
    color: #007BFF;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
}

.btn-login:hover {
    color: #0056b3;
}

.btn-register {
    background: #007BFF;
    color: #fff;
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.55rem 1.25rem;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, transform 0.15s;
}

.btn-register:hover {
    background: #0069d9;
    transform: translateY(-1px);
}

@media (max-width: 900px) {
    .navbar {
        padding: 0.9rem 1.5rem;
    }

    .nav-link {
        display: none;
    }
}
</style>