<template>
	<div>
		<h2>Tournament Rankings</h2>
		<div v-if="loading" class="loading">Loading rankings...</div>
		<div v-else>
			<div v-if="currentUserRank" class="current-user-rank">
				<h3>Your Current Ranking</h3>
				<div class="rank-card highlight">
					<div class="rank">#{{ currentUserRank.rank }}</div>
					<div class="player-info">
						<div class="name">{{ currentUserRank.username }}</div>
						<div class="score">{{ currentUserRank.score }} points</div>
					</div>
				</div>
			</div>

			<h3>Top Players</h3>
			<div class="rankings-list">
				<div v-for="player in rankings" :key="player.id" class="rank-card">
					<div class="rank">#{{ player.rank }}</div>
					<div class="player-info">
						<div class="name">{{ player.username }}</div>
						<div class="score">{{ player.score }} points</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(true)
const rankings = ref([])
const currentUserRank = ref(null)

onMounted(async () => {
	try {
		// Fetch tournament rankings
		const { data, error } = await supabase
			.from('tournament_rankings')
			.select('id, username, score')
			.order('score', { ascending: false })
		
		if (error) throw error
		
		// Add rank to each player
		rankings.value = data.map((player, index) => ({
			...player,
			rank: index + 1
		}))
		
		// If user is logged in, find their ranking
		if (user.value) {
			const { data: profileData } = await supabase
				.from('profiles')
				.select('username')
				.eq('id', user.value.id)
				.single()
			
			if (profileData) {
				const userRanking = rankings.value.find(
					player => player.username === profileData.username
				)
				if (userRanking) {
					currentUserRank.value = userRanking
				}
			}
		}
	} catch (error) {
		console.error('Error fetching rankings:', error)
	} finally {
		loading.value = false
	}
})
</script>

<style scoped>
.loading {
	text-align: center;
	padding: 2rem;
	font-style: italic;
	color: #666;
}

.current-user-rank {
	margin-bottom: 2rem;
	padding: 1rem;
	background-color: #f0f8ff;
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
	background-color: #f5f5f5;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.rank-card.highlight {
	background-color: #e6f7ff;
	border-left: 4px solid #1890ff;
}

.rank {
	font-size: 1.2rem;
	font-weight: bold;
	width: 50px;
}

.player-info {
	flex: 1;
}

.name {
	font-weight: bold;
}

.score {
	color: #666;
}
</style>
