<template>
    <section class="cta" ref="sectionRef" :class="{ visible: isVisible }">
        <div class="cta-orb cta-orb--1"></div>
        <div class="cta-orb cta-orb--2"></div>
        <h2 class="cta-title">{{ title }}</h2>
        <p class="cta-sub">{{ subtitle }}</p>
        <router-link :to="link" class="btn-cta">{{ buttonText }}</router-link>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    title: { type: String, default: '¿Listo para gestionar tus finanzas en Colombia?' },
    subtitle: { type: String, default: 'Únete a miles de colombianos que ya confían en NexoFin' },
    buttonText: { type: String, default: 'Abrir mi cuenta ahora — es gratis' },
    link: { type: String, default: '/register' },
})

const sectionRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
    const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) isVisible.value = true
    }, { threshold: 0.2 })
    if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<style scoped>
.cta {
    padding: 6rem 4rem;
    background: linear-gradient(135deg, #007BFF, #0041a8);
    text-align: center;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.97);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta.visible {
    opacity: 1;
    transform: scale(1);
}

.cta-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
}

.cta-orb--1 {
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    top: -100px;
    left: -100px;
}

.cta-orb--2 {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.08);
    bottom: -80px;
    right: -80px;
}

.cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    position: relative;
}

.cta-sub {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2.5rem;
    position: relative;
}

.btn-cta {
    display: inline-flex;
    align-items: center;
    background: #fff;
    color: #007BFF;
    text-decoration: none;
    font-size: 1.05rem;
    font-weight: 700;
    padding: 1rem 2.25rem;
    border-radius: 10px;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: relative;
}

.btn-cta:hover {
    background: #f0f7ff;
    transform: translateY(-2px);
}

@media (max-width: 900px) {
    .cta {
        padding: 4rem 1.5rem;
    }

    .cta-title {
        font-size: 1.8rem;
    }
}
</style>