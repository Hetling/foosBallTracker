<template>
  <div class="container">
    <div class="main-content">
      <h2>Tournament Rankings</h2>
      <div v-if="loading" class="loading">Loading rankings...</div>
      <div v-else>
        <CurrentUserRank :currentUserRank="currentUserRank" />
        <RankingList :rankings="rankings" />
      </div>
    </div>
    
    <div class="sidebar">
      <RecentMatches />
    </div>
  </div>
</template>

<script setup>
import RecentMatches from '@/components/RecentMatches.vue'
import CurrentUserRank from '@/components/ranking/CurrentUserRank.vue'
import RankingList from '@/components/ranking/RankingList.vue'

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

const fetchRankings = async () => {
  try {
    loading.value = true
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, elo, avatar_url')
      .order('elo', { ascending: false })
    
    if (error) throw error
    
    const processedPlayers = await Promise.all(
      profiles.map(async (player, index) => ({
        ...player,
        avatarUrl: player.avatar_url ? await downloadImage(player.avatar_url) : null,
        rank: index + 1
      }))
    )
    
    rankings.value = processedPlayers
    
    if (user.value) {
      currentUserRank.value = processedPlayers.find(p => p.id === user.value.id)
    }
  } catch (error) {
    console.error('Error fetching rankings:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRankings)
watch(user, fetchRankings)
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

@media (max-width: 768px) {
	.container {
		flex-direction: column;
	}
	
	.sidebar {
		width: 100%;
	}
}
</style>