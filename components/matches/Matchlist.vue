<template>
  <div>
    <div v-if="loading" class="loading">Loading matches...</div>
    <div v-else>
      <div v-if="matches.length === 0" class="no-matches">No matches found</div>
      <div v-else class="matches-list">
        <MatchCard 
          v-for="match in visibleMatches" 
          :key="match.id" 
          :match="match" 
        />
      </div>
      <LoadMoreButton 
        v-if="matches.length > initialLimit && visibleMatches.length < matches.length"
        @click="$emit('load-more')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MatchCard from './MatchCard.vue'
import LoadMoreButton from './LoadMoreButton.vue'

const props = defineProps({
  matches: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  visibleLimit: {
    type: Number,
    required: true
  }
})

const initialLimit = 8

const visibleMatches = computed(() => {
  return props.matches.slice(0, props.visibleLimit)
})
</script>

<style scoped>
.loading, .no-matches {
  text-align: center;
  padding: 1rem;
  color: #aaa;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
