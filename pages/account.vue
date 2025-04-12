<template>
    <form class="form-widget" @submit.prevent="updateProfile">
        <Avatar v-model:path="avatar_path" @upload="updateProfile" :size="10" />
        <div>
            <label for="email">Email</label>
            <input id="email" type="text" :value="user.email" disabled />
        </div>
        <div>
            <label for="username">Name</label>
            <input id="username" type="text" v-model="username" />
        </div>
        <div>
            <input type="submit" class="button block primary" :value="loading ? 'Loading ...' : 'Update'"
                :disabled="loading" />
        </div>

        <div>
            <button type="button" class="button block" @click="signOut">
                Sign Out
            </button>
        </div>
        
        <div>
            <NuxtLink to="/" class="button block secondary">
                Back to Rankings
            </NuxtLink>
        </div>
    </form>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)
const username = ref('')
const avatar_path = ref('')

const { data: profile } = await useAsyncData('profile', async () => {
    loading.value = true
    const { data } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.value.id)
        .single()

    loading.value = false
    return data
})

if (profile.value) {
    username.value = profile.value.username || ''
    avatar_path.value = profile.value.avatar_url || ''
}

async function updateProfile() {
    try {
        loading.value = true
        const updates = {
            id: user.value.id,
            username: username.value,
            avatar_url: avatar_path.value,
            updated_at: new Date(),
        }
        let { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
        // Navigate to home page after sign out
        await navigateTo('/')
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.button.secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    margin-top: 10px;
}

.button.secondary:hover {
    background-color: #e5e5e5;
}
</style>
