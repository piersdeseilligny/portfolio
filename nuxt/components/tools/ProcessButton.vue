<template>
      <button
        @click="emit('click')"
        :disabled="isBusy"
        class="process-btn"
      >
        <span>{{ isBusy ? processingText : actionText }}</span>
      </button>
</template>

<script setup lang="ts">
defineProps<{
  isBusy:boolean,
  actionText:string,
  processingText:string,
}>();
const emit = defineEmits<{
    (e:'click'):void;
}>();
</script>

<style scoped>
/* --- Button Styles --- */
.process-btn {
  background: var(--backgroundclick);
  color: white;
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  padding: 12px 24px;
  position:relative;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}
.process-btn::before{
  background-color: black;
  opacity:0.5;
  display:block;
  position:absolute;
  top:1px;
  left:1px;
  right:1px;
  bottom:1px;
  border-radius: 7px;
  content:'';
  z-index:1;
  transition: all 0.2s ease-out;
}
.process-btn>span{
  z-index:2;
  position: relative;
}

.process-btn:hover::before {
  opacity:0.3;
  top:2px;
  left:2px;
  right:2px;
  bottom:2px;
  border-radius: 6px;
}
.process-btn:active::before {
  opacity:0;
  top:2px;
  left:2px;
  right:2px;
  bottom:2px;
  border-radius: 6px;
}

.process-btn:disabled {
  background-color: #4a5668;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>