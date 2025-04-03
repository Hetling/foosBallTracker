<!-- components/ToastNotification.vue -->
<template>
  <transition name="fade">
    <div v-if="show" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'info' // can be 'info', 'success', 'error'
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 300px;
  animation: slideIn 0.3s ease-out;
}

.toast.info {
  background-color: #2196F3;
}

.toast.success {
  background-color: #4CAF50;
}

.toast.error {
  background-color: #F44336;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>