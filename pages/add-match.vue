<template>
  <div class="add-match-container">
    <h2>Add New Match</h2>
    
    <form @submit.prevent="submitMatch" class="match-form">
<div class="form-group">
    <label for="match-time">Match Date & Time</label>
    <VueDatePicker
      v-model="matchTime"
      id="match-time"
      required
      :enable-time-picker="true"
      :is-24="false"
      auto-apply
      placeholder="Select date and time"
    />
  </div>

      <div class="score-section">
        <div class="form-group">
          <label>Team 1 Score</label>
          <input 
            type="number" 
            min="0" 
            v-model="team1Score" 
            required
          />
        </div>
        
        <div class="vs">vs</div>
        
        <div class="form-group">
          <label>Team 2 Score</label>
          <input 
            type="number" 
            min="0" 
            v-model="team2Score" 
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label>
          <input 
            type="checkbox" 
            v-model="isDoubles" 
          />
          Doubles Match (2v2)
        </label>
      </div>

      <div class="teams-section">
        <div class="team">
          <h3>Team 1</h3>
          <div class="form-group">
            <label>Player 1</label>
            <select v-model="team1Player1" required>
              <option disabled value="">Select player</option>
              <option 
                v-for="player in players" 
                :key="player.id" 
                :value="player.id"
                :disabled="isPlayerSelected(player.id, 'team1Player1')"
              >
                {{ player.username }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="isDoubles">
            <label>Player 2</label>
            <select v-model="team1Player2">
              <option disabled value="">Select player</option>
              <option 
                v-for="player in players" 
                :key="player.id" 
                :value="player.id"
                :disabled="isPlayerSelected(player.id, 'team1Player2')"
              >
                {{ player.username }}
              </option>
            </select>
          </div>
        </div>

        <div class="team">
          <h3>Team 2</h3>
          <div class="form-group">
            <label>Player 1</label>
            <select v-model="team2Player1" required>
              <option disabled value="">Select player</option>
              <option 
                v-for="player in players" 
                :key="player.id" 
                :value="player.id"
                :disabled="isPlayerSelected(player.id, 'team2Player1')"
              >
                {{ player.username }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="isDoubles">
            <label>Player 2</label>
            <select v-model="team2Player2">
              <option disabled value="">Select player</option>
              <option 
                v-for="player in players" 
                :key="player.id" 
                :value="player.id"
                :disabled="isPlayerSelected(player.id, 'team2Player2')"
              >
                {{ player.username }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Submit Match' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">Match submitted successfully!</div>
    </form>
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)
const error = ref('')
const success = ref(false)
const players = ref([])

// Form data
const matchTime = ref('')
const team1Score = ref(0)
const team2Score = ref(0)
const isDoubles = ref(false)
const team1Player1 = ref('')
const team1Player2 = ref('')
const team2Player1 = ref('')
const team2Player2 = ref('')

// Fetch all players
onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('id, username')
      .order('username', { ascending: true })
    
    if (fetchError) throw fetchError
    players.value = data
  } catch (err) {
    console.error('Error fetching players:', err)
    error.value = 'Failed to load players'
  }
})

// Check if player is already selected in another field
const isPlayerSelected = (playerId, currentField) => {
  const fields = {
    team1Player1: team1Player1.value,
    team1Player2: team1Player2.value,
    team2Player1: team2Player1.value,
    team2Player2: team2Player2.value
  }
  
  // Remove current field from check
  delete fields[currentField]
  
  // Check if player is selected in any other field
  return Object.values(fields).includes(playerId)
}

// Submit match
const submitMatch = async () => {
  if (!user.value) {
    error.value = 'You must be logged in to submit a match'
    return
  }

  // Validate form
  if (isDoubles.value && (!team1Player2.value || !team2Player2.value)) {
    error.value = 'Please select all players for doubles match'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const { error: insertError } = await supabase
      .from('matches')
      .insert({
        match_time: matchTime.value,
        team1_score: team1Score.value,
        team2_score: team2Score.value,
        team1_player1: team1Player1.value,
        team1_player2: isDoubles.value ? team1Player2.value : null,
        team2_player1: team2Player1.value,
        team2_player2: isDoubles.value ? team2Player2.value : null
      })
    
    if (insertError) throw insertError
    
    success.value = true
    resetForm()
  } catch (err) {
    console.error('Error submitting match:', err)
    error.value = 'Failed to submit match: ' + err.message
  } finally {
    loading.value = false
  }
}

// Reset form after successful submission
const resetForm = () => {
  matchTime.value = ''
  team1Score.value = 0
  team2Score.value = 0
  isDoubles.value = false
  team1Player1.value = ''
  team1Player2.value = ''
  team2Player1.value = ''
  team2Player2.value = ''
}
</script>

<style scoped>
.dp__input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.add-match-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.match-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.score-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.vs {
  font-weight: bold;
  font-size: 1.2em;
}

.teams-section {
  display: flex;
  gap: 40px;
}

.team {
  flex: 1;
}

select, input[type="number"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: black;
  color: white; /* Ensure text is visible */
}

button {
  padding: 10px 15px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
}

.success-message {
  color: #10b981;
}

/* Style for VueDatePicker dropdown */
:deep(.dp__menu) {
  background-color: black;
  color: white;
}

:deep(.dp__calendar_header) {
  background-color: #333;
}

:deep(.dp__calendar_item) {
  color: white;
}

:deep(.dp__calendar_item:hover) {
  background-color: #444;
}

:deep(.dp__active_date) {
  background-color: #3b82f6;
}

:deep(.dp__action_buttons) {
  background-color: #333;
}
</style>
