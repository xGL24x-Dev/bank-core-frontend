<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
                <div class="modal-box">
                    <div class="modal-header">
                        <h3 class="modal-title">{{ title }}</h3>
                        <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
                    </div>
                    <div class="modal-body">
                        <slot />
                    </div>
                    <div class="modal-footer" v-if="$slots.footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(4px);
}

.modal-box {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
}

.modal-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a202c;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #6C757D;
    padding: 0.25rem;
    border-radius: 6px;
    transition: background 0.15s;
}

.modal-close:hover {
    background: #f8f9fa;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
    transform: scale(0.95) translateY(10px);
}
</style>