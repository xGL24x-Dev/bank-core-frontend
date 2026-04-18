<template>
    <button :class="['app-btn', `app-btn--${variant}`, { 'app-btn--block': block, 'app-btn--loading': loading }]"
        :disabled="disabled || loading" @click="$emit('click')">
        <span v-if="loading" class="app-btn__spinner"></span>
        <slot />
    </button>
</template>

<script setup>
defineProps({
    variant: { type: String, default: 'primary' }, // primary | outline | danger | ghost
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<style scoped>
.app-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    outline: none;
}

.app-btn--block {
    width: 100%;
}

.app-btn--primary {
    background: linear-gradient(135deg, #007BFF, #0056d6);
    color: #fff;
    box-shadow: 0 4px 18px rgba(0, 86, 255, 0.3);
}

.app-btn--primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 86, 255, 0.4);
}

.app-btn--outline {
    background: transparent;
    color: #007BFF;
    border: 1.5px solid #007BFF;
}

.app-btn--outline:hover:not(:disabled) {
    background: #f0f7ff;
    transform: translateY(-2px);
}

.app-btn--danger {
    background: linear-gradient(135deg, #dc3545, #b02a37);
    color: #fff;
    box-shadow: 0 4px 18px rgba(220, 53, 69, 0.3);
}

.app-btn--danger:hover:not(:disabled) {
    transform: translateY(-2px);
}

.app-btn--ghost {
    background: transparent;
    color: #6C757D;
}

.app-btn--ghost:hover:not(:disabled) {
    background: #f8f9fa;
    color: #212529;
}

.app-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

.app-btn--loading {
    opacity: 0.8;
    cursor: not-allowed;
}

.app-btn__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>