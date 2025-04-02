<template>
  <button class="load-more" @click="$emit('click')">
    Load More
  </button>
</template>

<style scoped>
.load-more {
  display: block;
  margin: 1rem auto 0;
  padding: 0.5rem 1.5rem;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.load-more:hover {
  background: #444;
}
</style>
