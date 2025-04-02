<template>
  <span>{{ playerName }}</span>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  playerId: {
    type: String,
    required: true
  }
})

const playerNames = inject('playerNames')
const playerName = computed(() => playerNames.value[props.playerId] || 'Unknown Player')
</script>
