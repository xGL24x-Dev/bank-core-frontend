<template>
    <section class="hero">
        <div class="hero-bg">
            <div class="orb orb--1"></div>
            <div class="orb orb--2"></div>
            <div class="orb orb--3"></div>
            <div class="grid"></div>
        </div>
        <div class="hero-content" :class="{ visible: isVisible }" ref="heroRef">
            <div class="hero-badge">{{ badge }}</div>
            <h1 class="hero-title" v-html="title"></h1>
            <p class="hero-subtitle">{{ subtitle }}</p>
            <div class="hero-actions">
                <router-link :to="primaryLink" class="btn-primary">
                    {{ primaryText }}
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </router-link>
                <router-link :to="secondaryLink" class="btn-outline">{{ secondaryText }}</router-link>
            </div>
            <div class="hero-stats">
                <template v-for="(s, i) in stats" :key="s.label">
                    <div class="stat">
                        <span class="stat-number">{{ s.number }}</span>
                        <span class="stat-label">{{ s.label }}</span>
                    </div>
                    <div class="stat-divider" v-if="i < stats.length - 1"></div>
                </template>
            </div>
        </div>
        <div class="hero-visual" :class="{ visible: isVisible }">
            <div class="card-mockup">
                <div class="mockup-card">
                    <div class="mockup-card-top">
                        <span class="mockup-bank">NexoFin</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                            class="mockup-chip">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 3v4M8 3v4M2 11h20" />
                        </svg>
                    </div>
                    <div class="mockup-number">4242 •••• •••• 8821</div>
                    <div class="mockup-bottom">
                        <div>
                            <div class="mockup-label">Titular</div>
                            <div class="mockup-value">Carlos Díaz</div>
                        </div>
                        <div>
                            <div class="mockup-label">Vence</div>
                            <div class="mockup-value">12/28</div>
                        </div>
                    </div>
                </div>
                <div class="mockup-balance">
                    <div class="balance-label">Saldo disponible</div>
                    <div class="balance-amount">$12.450.800</div>
                    <div class="balance-change">↑ +2.4% este mes</div>
                </div>
                <div class="mockup-transactions">
                    <div class="tx" v-for="tx in transactions" :key="tx.id">
                        <div class="tx-icon">{{ tx.icon }}</div>
                        <div class="tx-info">
                            <div class="tx-name">{{ tx.name }}</div>
                            <div class="tx-date">{{ tx.date }}</div>
                        </div>
                        <div class="tx-amount" :class="tx.type">{{ tx.amount }}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    badge: { type: String, default: '🇨🇴 Banca Digital Colombiana' },
    title: { type: String, default: 'Gestiona tus finanzas<br/><span class="gradient-text">con total confianza</span>' },
    subtitle: { type: String, default: 'NexoFin es el sistema bancario digital diseñado para colombianos.' },
    primaryText: { type: String, default: 'Crear mi cuenta' },
    primaryLink: { type: String, default: '/register' },
    secondaryText: { type: String, default: 'Ingresar a mi cuenta' },
    secondaryLink: { type: String, default: '/login' },
    stats: {
        type: Array, default: () => [
            { number: '+5.000', label: 'Usuarios activos' },
            { number: '$500M+', label: 'En transacciones COP' },
            { number: '99.9%', label: 'Disponibilidad' },
        ]
    },
    transactions: {
        type: Array, default: () => [
            { id: 1, icon: '🛒', name: 'Éxito Chapinero', date: 'Hoy 10:30', amount: '-$45.000', type: 'debit' },
            { id: 2, icon: '💼', name: 'Nómina empresa', date: 'Ayer 09:00', amount: '+$2.500.000', type: 'credit' },
            { id: 3, icon: '⚡', name: 'EPM Servicios', date: '28 Mar', amount: '-$80.000', type: 'debit' },
        ]
    },
})

const heroRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) isVisible.value = true
    }, { threshold: 0.15 })
    if (heroRef.value) observer.observe(heroRef.value)
})
</script>

<style scoped>
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7rem 4rem 4rem;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%);
    gap: 3rem;
}

.hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
}

.orb--1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 123, 255, 0.15), transparent 70%);
    top: -100px;
    left: -100px;
}

.orb--2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(40, 167, 69, 0.12), transparent 70%);
    bottom: -80px;
    right: -80px;
}

.orb--3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 86, 255, 0.08), transparent 70%);
    top: 40%;
    left: 50%;
}

.grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(0, 86, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 86, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 560px;
    opacity: 0;
    transform: translateX(-40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-content.visible {
    opacity: 1;
    transform: translateX(0);
}

.hero-visual {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.hero-visual.visible {
    opacity: 1;
    transform: translateX(0);
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(0, 123, 255, 0.08);
    color: #007BFF;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 99px;
    border: 1px solid rgba(0, 123, 255, 0.15);
    margin-bottom: 1.5rem;
}

.hero-title {
    font-size: 3.2rem;
    font-weight: 800;
    color: #1a202c;
    line-height: 1.15;
    letter-spacing: -0.04em;
    margin-bottom: 1.25rem;
}

:deep(.gradient-text) {
    background: linear-gradient(135deg, #007BFF, #28A745);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1rem;
    color: #6C757D;
    line-height: 1.75;
    margin-bottom: 2rem;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
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

.btn-primary svg {
    width: 16px;
    height: 16px;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 86, 255, 0.4);
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    color: #007BFF;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    border: 1.5px solid #007BFF;
    transition: background 0.15s, transform 0.15s;
}

.btn-outline:hover {
    background: #f0f7ff;
    transform: translateY(-2px);
}

.hero-stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.stat {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.02em;
}

.stat-label {
    font-size: 0.75rem;
    color: #6C757D;
}

.stat-divider {
    width: 1px;
    height: 36px;
    background: #dee2e6;
}

.card-mockup {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 320px;
}

.mockup-card {
    background: linear-gradient(135deg, #007BFF, #0041a8);
    border-radius: 18px;
    padding: 1.5rem;
    color: #fff;
    box-shadow: 0 20px 50px rgba(0, 86, 255, 0.3);
}

.mockup-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.mockup-bank {
    font-size: 1.1rem;
    font-weight: 700;
}

.mockup-chip {
    width: 28px;
    height: 28px;
    opacity: 0.8;
}

.mockup-number {
    font-size: 1rem;
    letter-spacing: 0.12em;
    margin-bottom: 1.25rem;
    opacity: 0.9;
}

.mockup-bottom {
    display: flex;
    justify-content: space-between;
}

.mockup-label {
    font-size: 0.68rem;
    opacity: 0.65;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.2rem;
}

.mockup-value {
    font-size: 0.9rem;
    font-weight: 600;
}

.mockup-balance {
    background: #fff;
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.balance-label {
    font-size: 0.75rem;
    color: #6C757D;
    margin-bottom: 0.3rem;
}

.balance-amount {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.03em;
}

.balance-change {
    font-size: 0.78rem;
    color: #28A745;
    font-weight: 600;
    margin-top: 0.2rem;
}

.mockup-transactions {
    background: #fff;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.tx {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.tx-icon {
    width: 36px;
    height: 36px;
    background: #f8f9fa;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.tx-info {
    flex: 1;
}

.tx-name {
    font-size: 0.83rem;
    font-weight: 600;
    color: #1a202c;
}

.tx-date {
    font-size: 0.72rem;
    color: #6C757D;
}

.tx-amount {
    font-size: 0.85rem;
    font-weight: 700;
}

.tx-amount.credit {
    color: #28A745;
}

.tx-amount.debit {
    color: #dc3545;
}

@media (max-width: 900px) {
    .hero {
        flex-direction: column;
        padding: 6rem 1.5rem 3rem;
        text-align: center;
    }

    .hero-title {
        font-size: 2.2rem;
    }

    .hero-actions {
        justify-content: center;
    }

    .hero-stats {
        justify-content: center;
    }

    .hero-visual {
        display: none;
    }
}
</style>