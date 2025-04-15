<template>
    <div class="rankings-list">
      <h3>Top Players</h3>
      <div class="list">
        <div v-for="player in rankings" :key="player.id" class="rank-card">
          <div class="rank">#{{ player.rank }}</div>
          <img 
            v-if="player.avatarUrl" 
            :src="player.avatarUrl" 
            alt="User avatar" 
            class="avatar"
          >
          <div v-else class="avatar-placeholder">
            {{ player.username.charAt(0).toUpperCase() }}
          </div>
          <div class="player-info">
            <div class="name">{{ player.username }}</div>
            <div class="score">{{ player.elo }} ELO</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    rankings: {
      type: Array,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .rankings-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .rank-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 4px;
    background-color: #1e1e1e;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    gap: 1rem;
  }
  
  .rank {
    font-size: 1.2rem;
    font-weight: bold;
    width: 50px;
    color: #1890ff;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1890ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .player-info {
    flex: 1;
  }
  
  .name {
    font-weight: bold;
  }
  
  .score {
    color: #aaa;
  }
  </style>