<template>
    <div class="loan-card">
        <div class="loan-header">
            <div class="loan-icon">🏦</div>
            <div class="loan-status" :class="`loan-status--${status}`">{{ statusLabel }}</div>
        </div>
        <div class="loan-amount">$ {{ amount }}</div>
        <div class="loan-label">Monto del préstamo</div>
        <div class="loan-info">
            <div class="loan-info-item">
                <span class="loan-info-label">Cuotas</span>
                <span class="loan-info-value">{{ cuotas }}</span>
            </div>
            <div class="loan-info-item">
                <span class="loan-info-label">Interés</span>
                <span class="loan-info-value">{{ interes }}%</span>
            </div>
            <div class="loan-info-item">
                <span class="loan-info-label">Fecha</span>
                <span class="loan-info-value">{{ fecha }}</span>
            </div>
        </div>
        <div class="loan-progress">
            <div class="loan-progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="loan-progress-label">{{ progress }}% pagado</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    amount: { type: String, required: true },
    cuotas: { type: Number, default: 12 },
    interes: { type: Number, default: 0 },
    fecha: { type: String, default: '' },
    status: { type: String, default: 'active' }, // 'active' | 'pending' | 'paid'
    progress: { type: Number, default: 0 },
})

const statusLabel = computed(() => {
    const labels = { active: 'Activo', pending: 'Pendiente', paid: 'Pagado' }
    return labels[props.status] || props.status
})
</script>

<style scoped>
.loan-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: transform 0.15s, box-shadow 0.15s;
}

.loan-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.loan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.loan-icon {
    font-size: 1.5rem;
}

.loan-status {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    font-family: 'Inter', sans-serif;
}

.loan-status--active {
    background: rgba(40, 167, 69, 0.1);
    color: #28A745;
}

.loan-status--pending {
    background: rgba(255, 193, 7, 0.1);
    color: #d97706;
}

.loan-status--paid {
    background: rgba(0, 123, 255, 0.1);
    color: #007BFF;
}

.loan-amount {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.03em;
    font-family: 'Inter', sans-serif;
}

.loan-label {
    font-size: 0.75rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    margin-bottom: 1.25rem;
}

.loan-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.loan-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.loan-info-label {
    font-size: 0.7rem;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
}

.loan-info-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.loan-progress {
    height: 6px;
    background: #f0f0f0;
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 0.4rem;
}

.loan-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #007BFF, #28A745);
    border-radius: 99px;
    transition: width 0.5s;
}

.loan-progress-label {
    font-size: 0.72rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
}
</style>