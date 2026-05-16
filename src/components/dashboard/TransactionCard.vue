<template>
    <div class="tx-item">
        <div class="tx-logo">{{ icon }}</div>
        <div class="tx-info">
            <div class="tx-name">{{ name }}</div>
            <div class="tx-date">{{ date }}</div>
        </div>
        <div class="tx-amount" :class="type === 'credit' ? 'tx-amount--credit' : 'tx-amount--debit'">
            {{ type === 'credit' ? '+' : '-' }}$ {{ amount }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: String, required: true },
    type: { type: String, default: 'debit' }, // 'credit' | 'debit'
})
</script>

<style scoped>
.tx-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    transition: background 0.15s;
    cursor: pointer;
}

.tx-item:hover {
    background: #f8faff;
}

.tx-logo {
    width: 38px;
    height: 38px;
    background: #f0f4ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.tx-info {
    flex: 1;
}

.tx-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1a202c;
    font-family: 'Inter', sans-serif;
}

.tx-date {
    font-size: 0.72rem;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
}

.tx-amount {
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
}

.tx-amount--credit {
    color: #28A745;
}

.tx-amount--debit {
    color: #dc3545;
}
</style>