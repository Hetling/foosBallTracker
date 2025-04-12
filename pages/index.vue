<template>
	<div class="container">
		<div class="main-content">
			<h2>Tournament Rankings</h2>
			
			<div v-if="loading" class="loading">Loading rankings...</div>
			<div v-else>
				<div v-if="currentUserRank" class="current-user-rank">
					<h3>Your Current Ranking</h3>
					<div class="rank-card highlight">
						<div class="rank">#{{ currentUserRank.rank }}</div>
						<div class="player-info">
							<div class="name">{{ currentUserRank.username }}</div>
							<div class="score">{{ currentUserRank.elo }} ELO</div>
						</div>
					</div>
				</div>

				<h3>Top Players</h3>
				<div class="rankings-list">
					<div v-for="player in rankings" :key="player.id" class="rank-card">
						<div class="rank">#{{ player.rank }}</div>
						<div class="player-info">
							<div class="name">{{ player.username }}</div>
							<div class="score">{{ player.elo }} ELO</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="sidebar">
			<RecentMatches />
		</div>
	</div>
</template>

<script setup>
import RecentMatches from '@/components/RecentMatches.vue'
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)
const rankings = ref([])
const currentUserRank = ref(null)

// Fetch rankings data
const fetchRankings = async () => {
  try {
    loading.value = true
    
    // Fetch all profiles ordered by ELO (descending)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, elo')
      .order('elo', { ascending: false })
    
    if (error) throw error
    
    // Add rank to each player
    if (data) {
      rankings.value = data.map((player, index) => ({
        ...player,
        rank: index + 1
      }))
      
      // Find current user's rank if logged in
      if (user.value) {
        const userRank = rankings.value.find(p => p.id === user.value.id)
        if (userRank) {
          currentUserRank.value = userRank
        }
      }
    }
  } catch (error) {
    console.error('Error fetching rankings:', error)
  } finally {
    loading.value = false
  }
}

// Fetch data when component mounts
onMounted(fetchRankings)

// Optional: Refresh data when user logs in/out
watch(user, () => {
  fetchRankings()
})
</script>

<style scoped>
/* Your existing styles remain the same */
.container {
	display: flex;
	gap: 2rem;
	padding: 1rem;
	background-color: #121212;
	color: #fff;
}

.main-content {
	flex: 1;
}

.sidebar {
	width: 450px;
	overflow: scroll;
	max-height: 50rem;
}

.loading {
	text-align: center;
	padding: 2rem;
	font-style: italic;
	color: #aaa;
}

.actions {
	margin: 1rem 0;
}

.add-match-button {
	display: inline-block;
	padding: 0.5rem 1rem;
	background-color: #1890ff;
	color: white;
	border-radius: 4px;
	text-decoration: none;
	transition: background-color 0.2s;
}

.add-match-button:hover {
	background-color: #40a9ff;
}

.current-user-rank {
	margin-bottom: 2rem;
	padding: 1rem;
	background-color: #1a2a3a;
	border-radius: 8px;
}

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
}

.rank-card.highlight {
	background-color: #1a3a4a;
	border-left: 4px solid #1890ff;
}

.rank {
	font-size: 1.2rem;
	font-weight: bold;
	width: 50px;
	color: #1890ff;
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

@media (max-width: 768px) {
	.container {
		flex-direction: column;
	}
	
	.sidebar {
		width: 100%;
	}
}
</style>
