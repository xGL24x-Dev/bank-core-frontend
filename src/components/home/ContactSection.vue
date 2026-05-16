<template>
    <section class="contact-section" id="contacto" ref="sectionRef">
        <div class="section-header" :class="{ visible: isVisible }">
            <div class="section-badge">{{ badge }}</div>
            <h2 class="section-title">{{ title }}</h2>
            <p class="section-sub">{{ subtitle }}</p>
        </div>
        <div class="contact-grid">
            <div class="contact-card" v-for="(c, i) in contacts" :key="c.title" :class="{ visible: isVisible }"
                :style="{ transitionDelay: `${0.1 + i * 0.12}s` }">
                <div class="contact-icon">{{ c.icon }}</div>
                <h3 class="contact-title">{{ c.title }}</h3>
                <p class="contact-info">{{ c.info }}</p>
                <p class="contact-hours">{{ c.hours }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    badge: { type: String, default: '📞 Atención al Cliente' },
    title: { type: String, default: '¿Necesitas ayuda?' },
    subtitle: { type: String, default: 'Estamos disponibles para atenderte en todo Colombia' },
    contacts: {
        type: Array, default: () => [
            { icon: '📞', title: 'Línea Gratuita Nacional', info: '01 8000 123 456', hours: 'Lunes a viernes 8am - 6pm' },
            { icon: '💬', title: 'Chat en Línea', info: 'nexofin.com.co/chat', hours: 'Disponible 24/7' },
            { icon: '📧', title: 'Correo Electrónico', info: 'contacto@nexofin.com.co', hours: 'Respuesta en menos de 24 horas' },
            { icon: '📍', title: 'Oficina Principal', info: 'Cra 7 # 32-16, Bogotá D.C.', hours: 'Lunes a viernes 8am - 5pm' },
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
.contact-section {
    padding: 6rem 4rem;
    background: #f8faff;
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

.contact-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
}

.contact-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.75rem;
    text-align: center;
    border: 1px solid #e9ecef;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s, transform 0.6s, box-shadow 0.2s;
}

.contact-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.contact-card:hover {
    box-shadow: 0 8px 24px rgba(0, 86, 255, 0.08);
    transform: translateY(-3px) !important;
}

.contact-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
}

.contact-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.4rem;
}

.contact-info {
    font-size: 0.85rem;
    color: #007BFF;
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.contact-hours {
    font-size: 0.78rem;
    color: #6C757D;
}

@media (max-width: 900px) {
    .contact-section {
        padding: 4rem 1.5rem;
    }

    .contact-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>