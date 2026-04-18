<template>
    <section class="features" id="servicios">
        <div class="section-header" ref="headerRef" :class="{ visible: headerVisible }">
            <div class="section-badge">{{ badge }}</div>
            <h2 class="section-title">{{ title }}</h2>
            <p class="section-sub">{{ subtitle }}</p>
        </div>
        <div class="features-grid">
            <div class="feature-card" v-for="(feature, i) in features" :key="feature.title"
                :ref="el => cardRefs[i] = el" :class="{ visible: cardVisible[i] }"
                :style="{ transitionDelay: `${i * 0.1}s` }">
                <div class="feature-icon">{{ feature.icon }}</div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-desc">{{ feature.desc }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const props = defineProps({
    badge: { type: String, default: '🏦 Nuestros Servicios' },
    title: { type: String, default: 'Todo lo que necesitas en un solo lugar' },
    subtitle: { type: String, default: 'Productos financieros pensados para los colombianos' },
    features: {
        type: Array, default: () => [
            { icon: '💳', title: 'Cuenta de Ahorros', desc: 'Abre tu cuenta sin cuota de manejo y con rendimientos en pesos colombianos.' },
            { icon: '⚡', title: 'Transferencias PSE', desc: 'Envía y recibe dinero a cualquier banco colombiano de forma inmediata.' },
            { icon: '📊', title: 'Control de Gastos', desc: 'Visualiza tus movimientos en pesos y toma mejores decisiones financieras.' },
            { icon: '🏦', title: 'Créditos de Libre Inversión', desc: 'Solicita tu crédito con tasas en DTF y aprobación en minutos.' },
            { icon: '🔔', title: 'Alertas por SMS y Correo', desc: 'Recibe notificaciones de cada transacción al instante en tu celular.' },
            { icon: '📱', title: 'Banca Móvil 24/7', desc: 'Accede a tus productos financieros desde cualquier lugar de Colombia.' },
        ]
    }
})

const headerRef = ref(null)
const headerVisible = ref(false)
const cardRefs = reactive([])
const cardVisible = reactive({})

onMounted(() => {
    const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) headerVisible.value = true
    }, { threshold: 0.2 })
    if (headerRef.value) obs.observe(headerRef.value)

    props.features.forEach((_, i) => {
        cardVisible[i] = false
        const cardObs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) cardVisible[i] = true
        }, { threshold: 0.1 })
        setTimeout(() => { if (cardRefs[i]) cardObs.observe(cardRefs[i]) }, 100)
    })
})
</script>

<style scoped>
.features {
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

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
}

.feature-card {
    background: #f8faff;
    border: 1px solid #e9ecef;
    border-radius: 16px;
    padding: 2rem;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s, transform 0.6s, box-shadow 0.2s, border-color 0.2s;
}

.feature-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 30px rgba(0, 86, 255, 0.1);
    border-color: rgba(0, 123, 255, 0.2);
}

.feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.feature-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
}

.feature-desc {
    font-size: 0.875rem;
    color: #6C757D;
    line-height: 1.6;
}

@media (max-width: 900px) {
    .features {
        padding: 4rem 1.5rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>