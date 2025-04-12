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

				<h3>Top Players</h3>
				<div class="rankings-list">
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

const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path)
    if (error) throw error
    return URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
    return null
  }
}

// Fetch rankings data
const fetchRankings = async () => {
  try {
    loading.value = true
    
    // Fetch all profiles ordered by ELO (descending) including avatar_url
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, elo, avatar_url')
      .order('elo', { ascending: false })
    
    if (error) throw error
    
    // Process player data with avatars
    if (data) {
      const processedPlayers = []
      
      for (const player of data) {
        let avatarUrl = null
        if (player.avatar_url) {
          avatarUrl = await downloadImage(player.avatar_url)
        }
        
        processedPlayers.push({
          ...player,
          avatarUrl,
          rank: processedPlayers.length + 1
        })
      }
      
      rankings.value = processedPlayers
      
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
	gap: 1rem;
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

@media (max-width: 768px) {
	.container {
		flex-direction: column;
	}
	
	.sidebar {
		width: 100%;
	}
}
</style>