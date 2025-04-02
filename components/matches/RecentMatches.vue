<template>
  <div class="recent-matches">
    <h2>Recent Matches</h2>
    <div v-if="loading" class="loading">Loading matches...</div>
    <div v-else>
      <div v-if="matches.length === 0" class="no-matches">No matches found</div>
      <div v-else class="matches-list">
        <!-- Show only the first 8 matches initially -->
        <div v-for="match in visibleMatches" :key="match.id" class="match-card">
          <div class="match-time">{{ formatDate(match.match_time) }}</div>
          <div class="teams-container">
            <div class="team team1">
              <div class="player">
                {{ getPlayerName(match.team1_player1) }}
                <span v-if="match.team1_player2"> & {{ getPlayerName(match.team1_player2) }}</span>
              </div>
              <div class="score">{{ match.team1_score }}</div>
            </div>
            <div class="vs">vs</div>
            <div class="team team2">
              <div class="score">{{ match.team2_score }}</div>
              <div class="player">
                {{ getPlayerName(match.team2_player1) }}
                <span v-if="match.team2_player2"> & {{ getPlayerName(match.team2_player2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Show "Load More" button if there are more matches to show -->
      <button 
        v-if="matches.length > initialLimit && visibleMatches.length < matches.length" 
        @click"showMoreMatches" 
        class="load-more"
      >
        Load More
      </button>
    </div
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const matches = ref([])
const loading = ref(true)
const playerNames = ref({}) // Cache for player names
const initialLimit = 8 // Show first 8 matches initially
const visibleLimit = ref(initialLimit)

// Fetch recent matches
const fetchRecentMatches = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_time', { ascending: false })
      .limit(20) // Get more than we initially display
    
    if (error) throw error
    
    matches.value = data
    
    // Get unique player IDs to fetch names
    const playerIds = new Set()
    data.forEach(match => {
      playerIds.add(match.team1_player1)
      if (match.team1_player2) playerIds.add(match.team1_player2)
      playerIds.add(match.team2_player1)
      if (match.team2_player2) playerIds.add(match.team2_player2)
    })
    
    // Fetch player names
    await fetchPlayerNames([...playerIds])
    
  } catch (error) {
    console.error('Error fetching matches:', error)
  } finally {
    loading.value = false
  }
}

// Computed property for visible matches
const visibleMatches = computed(() => {
  return matches.value.slice(0, visibleLimit.value)
})

// Function to show more matches
const showMoreMatches = () => {
  // Increase the limit by 8 each time, or show all remaining matches
  visibleLimit.value = Math.min(visibleLimit.value + 8, matches.value.length)
}

// Fetch player names from profiles table
const fetchPlayerNames = async (playerIds) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', playerIds)
    
    if (error) throw error
    
    // Store names in cache
    data.forEach(profile => {
      playerNames.value[profile.id] = profile.username
    })
    
  } catch (error) {
    console.error('Error fetching player names:', error)
  }
}

// Helper to get player name from cache
const getPlayerName = (playerId) => {
  return playerNames.value[playerId] || 'Unknown Player'
}

// Format date for display
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

// Fetch data when component mounts
onMounted(() => {
  fetchRecentMatches()
})
</script>

<style scoped>
.recent-matches {
  margin: 2rem 0;
  padding: 1rem;
  background: #222;
  border-radius: 8px;
  color: #fff;
}

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
