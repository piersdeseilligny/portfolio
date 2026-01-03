<template>
  <div class="input-wrapper">
    <label v-if="type === 'checkbox'" class="input-label checkbox-layout">
      <input
        type="checkbox"
        :checked="isChecked"
        @change="handleCheckboxChange"
        class="hidden-input"
      />
      <span class="checkbox-styled"></span>
      <div class="text-group">
        <span class="title">
          {{ label }}
          <span v-if="required" class="required-mark">*</span>
        </span>
        <span v-if="subtext" class="subtitle">{{ subtext }}</span>
      </div>
    </label>

    <div v-else-if="type === 'radio'" class="radio-group-layout">
      <div class="text-group mb-2">
        <span class="title">
          {{ label }}
          <span v-if="required" class="required-mark">*</span>
        </span>
        <span v-if="subtext" class="subtitle block">{{ subtext }}</span>
      </div>
      <div class="radio-options">
        <label v-for="option in options" :key="option.value" class="radio-option">
          <input
            type="radio"
            :name="name"
            :value="option.value"
            :checked="actualValue === option.value"
            @change="updateValue(option.value)"
          />
          <span class="radio-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <label v-else class="input-label text-layout">
      <div class="text-group mb-1">
        <span class="title">
          {{ label }}
          <span v-if="required" class="required-mark">*</span>
        </span>
        <span v-if="subtext" class="subtitle">{{ subtext }}</span>
      </div>
      <input
        type="text"
        :value="textValue"
        @input="handleTextChange"
        class="text-input-field"
        :placeholder="placeholder"
      />
    </label>

    <div v-if="warning" class="warning-icon-wrapper" :title="warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="warning-icon"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface RadioOption {
  label: string;
  value: string | number;
}

interface Props {
  modelValue?: boolean | string | number; 
  value?: boolean | string | number; 
  type?: 'checkbox' | 'radio' | 'text';
  label: string;
  subtext?: string;
  warning?: string | null;
  name?: string;
  placeholder?: string; // This was already here, it works!
  required?: boolean;   // Added this
  options?: RadioOption[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  subtext: '',
  warning: null,
  options: () => [],
  modelValue: undefined,
  value: undefined,
  required: false, // Default to false
});

const emit = defineEmits(['update:modelValue', 'input']);

// --- Computed Helpers ---

const actualValue = computed(() => {
  return props.modelValue !== undefined ? props.modelValue : props.value;
});

const isChecked = computed(() => {
  return actualValue.value === true;
});

const textValue = computed(() => {
  const val = actualValue.value;
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return '';
  return String(val);
});

// --- Handlers ---

const updateValue = (val: boolean | string | number) => {
  emit('update:modelValue', val);
  emit('input', val);
};

const handleCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateValue(target.checked);
};

const handleTextChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateValue(target.value);
};
</script>

<style scoped>
.input-wrapper {
  background-color: var(--background2color);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  border: 1px solid var(--background2color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top:6px;
}

.input-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.input-label {
  display: flex;
  cursor: pointer;
  flex-grow: 1;
}

.text-group {
  display: flex;
  flex-direction: column;
}
.checkbox-layout .text-group {
  margin-left: 12px;
}

.title {
  font-weight: 600;
  color: #e2e8f0;
}

/* NEW: Style for the required asterisk */
.required-mark {
  color: #fc8181; /* Red/Pink color */
  margin-left: 2px;
  font-weight: bold;
}

.subtitle {
  font-size: 0.875rem;
  color: #a0aec0;
}

/* Checkbox */
.hidden-input { display: none; }
.checkbox-layout { align-items: center; }
.checkbox-styled {
  width: 20px; height: 20px;
  border: solid 1px var(--foregroundsubtle);
  border-radius: 4px;
  flex-shrink: 0; position: relative;
  transition: all 0.2s ease;
}
.checkbox-styled::after {
  content: ''; position: absolute; display: none;
  left: 6px; top: 2px; width: 5px; height: 10px;
  border: solid white; border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}
.hidden-input:checked + .checkbox-styled { background: var(--backgroundclick); }
.hidden-input:checked + .checkbox-styled::after { display: block; }

/* Text */
.text-layout { flex-direction: column; cursor: default; }
.text-input-field {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--foregroundsubtle);
  color: var(--foreground);
  padding: 8px;
  border-radius: 4px;
  margin-top: 4px;
}
/* Style for Placeholder text color if needed */
.text-input-field::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Radio */
.radio-group-layout { flex-grow: 1; }
.radio-options { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
.radio-option { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #e2e8f0; }

/* Warning */
.warning-icon-wrapper { flex-shrink: 0; margin-left: 16px; cursor: help; align-self: flex-start; margin-top: 2px; }
.warning-icon { color: #fbd38d; }

.mb-1 { margin-bottom: 4px; }
.mb-2 { margin-bottom: 8px; }
.block { display: block; }
</style>