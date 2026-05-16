<template>
    <div class="app-input-wrapper">
        <label v-if="label" class="app-input__label">{{ label }}</label>
        <div class="app-input__container" :class="{ 'app-input--error': error, 'app-input--focused': isFocused }">
            <span v-if="icon" class="app-input__icon">{{ icon }}</span>
            <input :type="inputType" :placeholder="placeholder" :value="modelValue" :disabled="disabled"
                class="app-input__field" @input="$emit('update:modelValue', $event.target.value)"
                @focus="isFocused = true" @blur="isFocused = false" />
            <button v-if="type === 'password'" type="button" class="app-input__toggle"
                @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
            </button>
        </div>
        <span v-if="error" class="app-input__error">{{ error }}</span>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    icon: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])

const isFocused = ref(false)
const showPassword = ref(false)
const inputType = computed(() => props.type === 'password' && showPassword.value ? 'text' : props.type)
</script>

<style scoped>
.app-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
}

.app-input__label {
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.app-input__container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border: 1.5px solid #dee2e6;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.app-input--focused {
    border-color: #007BFF;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.12);
}

.app-input--error {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.app-input__icon {
    font-size: 1rem;
    flex-shrink: 0;
}

.app-input__field {
    flex: 1;
    border: none;
    outline: none;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #212529;
    background: transparent;
}

.app-input__field::placeholder {
    color: #adb5bd;
}

.app-input__toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
}

.app-input__error {
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    color: #dc3545;
    font-weight: 500;
}
</style>