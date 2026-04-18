<template>
    <section class="security" id="seguridad" ref="sectionRef" :class="{ visible: isVisible }">
        <div class="security-content">
            <div class="section-badge">{{ badge }}</div>
            <h2 class="section-title">{{ title }}</h2>
            <p class="section-sub">{{ subtitle }}</p>
            <div class="security-list">
                <div class="security-item" v-for="(item, i) in items" :key="i"
                    :style="{ transitionDelay: `${0.3 + i * 0.08}s` }">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    {{ item }}
                </div>
            </div>
            <router-link to="/register" class="btn-primary">Abrir cuenta segura</router-link>
        </div>
        <div class="security-visual">
            <div class="shield-box">
                <div class="shield-icon">🛡️</div>
                <div class="shield-title">Protección 24/7</div>
                <div class="shield-sub">Monitoreo permanente de todas tus operaciones bancarias</div>
                <div class="shield-badges">
                    <span class="badge" v-for="b in badges" :key="b">{{ b }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    badge: { type: String, default: '🔒 Seguridad Bancaria' },
    title: { type: String, default: 'Tu dinero protegido bajo la normativa colombiana' },
    subtitle: { type: String, default: 'Cumplimos con la Superintendencia Financiera de Colombia.' },
    items: {
        type: Array, default: () => [
            'Vigilado por la Superintendencia Financiera de Colombia',
            'Cifrado SSL de 256 bits en todas las conexiones',
            'Autenticación de dos factores (2FA)',
            'Sistema de prevención de fraudes en tiempo real',
            'Cumplimiento con la Ley 1581 de Habeas Data',
            'Certificación PCI DSS para pagos con tarjeta',
        ]
    },
    badges: { type: Array, default: () => ['SSL 256-bit', '2FA', 'JWT Auth', 'Cifrado', 'SFC'] }
})

const sectionRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
    const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true
    }, { threshold: 0.15 })
    if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<style scoped>
.security {
    padding: 6rem 4rem;
    background: linear-gradient(135deg, #f8faff, #f0fdf4);
    display: flex;
    align-items: center;
    gap: 4rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.security.visible {
    opacity: 1;
    transform: translateY(0);
}

.security-content {
    flex: 1;
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
    font-size: 2rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;
}

.section-sub {
    font-size: 0.95rem;
    color: #6C757D;
    line-height: 1.6;
}

.security-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin: 1.75rem 0 2rem;
}

.security-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: #374151;
    font-weight: 500;
}

.security-item svg {
    width: 18px;
    height: 18px;
    color: #28A745;
    flex-shrink: 0;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 700;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 18px rgba(0, 86, 255, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 86, 255, 0.4);
}

.security-visual {
    flex-shrink: 0;
}

.shield-box {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    box-shadow: 0 8px 40px rgba(0, 86, 255, 0.1);
    border: 1px solid rgba(0, 123, 255, 0.1);
    width: 300px;
}

.shield-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
}

.shield-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
}

.shield-sub {
    font-size: 0.82rem;
    color: #6C757D;
    line-height: 1.5;
    margin-bottom: 1.5rem;
}

.shield-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.badge {
    background: rgba(0, 123, 255, 0.08);
    color: #007BFF;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.7rem;
    border-radius: 99px;
    border: 1px solid rgba(0, 123, 255, 0.15);
}

@media (max-width: 900px) {
    .security {
        flex-direction: column;
        padding: 4rem 1.5rem;
    }

    .shield-box {
        width: 100%;
    }
}
</style>