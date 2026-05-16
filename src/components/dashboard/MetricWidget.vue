<template>
    <div class="metric-card">
        <div class="metric-icon" :style="{ background: bg }">
            <span>{{ icon }}</span>
        </div>
        <div class="metric-info">
            <div class="metric-value">{{ value }}</div>
            <div class="metric-label">{{ label }}</div>
        </div>
        <div class="metric-change" :class="positive ? 'metric-change--up' : 'metric-change--down'">
            {{ positive ? '↑' : '↓' }} {{ change }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: { type: String, required: true },
    positive: { type: Boolean, default: true },
    bg: { type: String, default: 'rgba(0,123,255,0.1)' },
})
</script>

<style scoped>
.metric-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.25rem;
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: transform 0.15s, box-shadow 0.15s;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.metric-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
}

.metric-info {
    flex: 1;
}

.metric-value {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.02em;
}

.metric-label {
    font-size: 0.72rem;
    color: #6C757D;
    font-family: 'Inter', sans-serif;
    margin-top: 0.15rem;
}

.metric-change {
    font-size: 0.75rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
}

.metric-change--up {
    color: #28A745;
}

.metric-change--down {
    color: #dc3545;
}
</style>