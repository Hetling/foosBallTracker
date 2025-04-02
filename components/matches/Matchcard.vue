<template>
  <div class="match-card">
    <div class="match-time">{{ formatDate(match.match_time) }}</div>
    <MatchTeams :match="match" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import MatchTeams from './MatchTeams.vue'

const props = defineProps({
  match: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.match-card {
  background: #111;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: #fff;
  text-wrap: wrap;
}

.match-time {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
</style>
