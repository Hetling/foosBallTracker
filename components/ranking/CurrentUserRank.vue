<template>
    <div v-if="currentUserRank" class="current-user-rank">
      <h3>Your Current Ranking</h3>
      <div class="rank-card highlight">
        <div class="rank">#{{ currentUserRank.rank }}</div>
        <img 
          v-if="currentUserRank.avatarUrl" 
          :src="currentUserRank.avatarUrl" 
          alt="User avatar" 
          class="avatar"
        >
        <div v-else class="avatar-placeholder">
          {{ currentUserRank.username.charAt(0).toUpperCase() }}
        </div>
        <div class="player-info">
          <div class="name">{{ currentUserRank.username }}</div>
          <div class="score">{{ currentUserRank.elo }} ELO</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    currentUserRank: {
      type: Object,
      default: null
    }
  })
  </script>
  
  <style scoped>
  .current-user-rank {
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #1a2a3a;
    border-radius: 8px;
  }
  
  .highlight {
    background-color: #1a3a4a;
    border-left: 4px solid #1890ff;
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