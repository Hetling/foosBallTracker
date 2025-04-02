<template>
  <div class="teams-container">
    <div class="team team1">
      <div class="player">
        <MatchPlayer :player-id="match.team1_player1" />
        <span v-if="match.team1_player2"> & <MatchPlayer :player-id="match.team1_player2" /></span>
      </div>
      <div class="score">{{ match.team1_score }}</div>
    </div>
    <div class="vs">vs</div>
    <div class="team team2">
      <div class="score">{{ match.team2_score }}</div>
      <div class="player">
        <MatchPlayer :player-id="match.team2_player1" />
        <span v-if="match.team2_player2"> & <MatchPlayer :player-id="match.team2_player2" /></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import MatchPlayer from './MatchPlayer.vue'

defineProps({
  match: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.teams-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.team {
  display: flex;
  align-items: center;
  flex: 1;
}

.team1 {
  justify-content: flex-end;
  text-align: right;
}

.team2 {
  justify-content: flex-start;
  text-align: left;
}

.player {
  margin: 0 0.5rem;
  color: #fff;
}

.score {
  font-weight: bold;
  font-size: 1.2rem;
  min-width: 2rem;
  text-align: center;
  color: #fff;
}

.vs {
  margin: 0 1rem;
  color: #aaa;
  font-weight: bold;
}
</style>
