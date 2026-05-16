<template>
    <section class="accounts-section" ref="sectionRef">
        <div class="section-header" :class="{ visible: isVisible }">
            <div class="section-badge">{{ badge }}</div>
            <h2 class="section-title">{{ title }}</h2>
            <p class="section-sub">{{ subtitle }}</p>
        </div>
        <div class="accounts-grid">
            <div class="account-card" v-for="(account, i) in accounts" :key="account.name"
                :class="{ visible: isVisible }" :style="{ transitionDelay: `${0.2 + i * 0.15}s` }">
                <div class="account-icon">{{ account.icon }}</div>
                <h3 class="account-name">{{ account.name }}</h3>
                <p class="account-desc">{{ account.desc }}</p>
                <ul class="account-features">
                    <li v-for="f in account.features" :key="f">✓ {{ f }}</li>
                </ul>
                <router-link to="/register" class="btn-account">Abrir esta cuenta</router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    badge: { type: String, default: '💼 Tipos de Cuenta' },
    title: { type: String, default: 'Elige la cuenta que se adapta a ti' },
    subtitle: { type: String, default: 'Productos diseñados para cada etapa de tu vida financiera' },
    accounts: {
        type: Array, default: () => [
            { icon: '💰', name: 'Cuenta de Ahorros', desc: 'Ideal para guardar y hacer crecer tu dinero sin complicaciones.', features: ['Sin cuota de manejo', 'Rendimientos anuales', 'Tarjeta débito gratis', 'Retiros en cajeros'] },
            { icon: '🏢', name: 'Cuenta Corriente', desc: 'Perfecta para empresas y personas con alto movimiento.', features: ['Chequera disponible', 'Sobregiro autorizado', 'Extracto mensual', 'Múltiples firmas'] },
            { icon: '🎓', name: 'Cuenta Universitaria', desc: 'Diseñada para estudiantes universitarios colombianos.', features: ['Cero cuota de manejo', 'Descuentos en aliados', 'App móvil gratuita', 'Sin saldo mínimo'] },
        ]
    }
})

const sectionRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
    const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true
    }, { threshold: 0.1 })
    if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<style scoped>
.accounts-section {
    padding: 6rem 4rem;
    background: #fff;
}

.section-header {
    text-align: center;
    margin-bottom: 3.5rem;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.section-header.visible {
    opacity: 1;
    transform: translateY(0);
}

.section-badge {
    display: inline-flex;
    background: rgba(0, 123, 255, 0.08);
    color: #007BFF;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 99px;
    border: 1px solid rgba(0, 123, 255, 0.15);
    margin-bottom: 1rem;
}

.section-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;
}

.section-sub {
    font-size: 1rem;
    color: #6C757D;
}

.accounts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
}

.account-card {
    border: 1.5px solid #e9ecef;
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s, transform 0.6s, box-shadow 0.2s, border-color 0.2s;
}

.account-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.account-card:hover {
    box-shadow: 0 12px 30px rgba(0, 86, 255, 0.1);
    border-color: #007BFF;
}

.account-icon {
    font-size: 2.5rem;
}

.account-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a202c;
}

.account-desc {
    font-size: 0.875rem;
    color: #6C757D;
    line-height: 1.6;
}

.account-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin: 0.5rem 0;
}

.account-features li {
    font-size: 0.82rem;
    color: #374151;
    font-weight: 500;
}

.btn-account {
    display: block;
    text-align: center;
    background: #f0f7ff;
    color: #007BFF;
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.65rem;
    border-radius: 8px;
    border: 1.5px solid rgba(0, 123, 255, 0.2);
    transition: background 0.2s;
    margin-top: auto;
}

.btn-account:hover {
    background: #007BFF;
    color: #fff;
}

@media (max-width: 900px) {
    .accounts-section {
        padding: 4rem 1.5rem;
    }

    .accounts-grid {
        grid-template-columns: 1fr;
    }
}
</style>