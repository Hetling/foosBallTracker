<template>
    <form class="row flex flex-center">
        <div class="col-6 form-widget">
            <h1 class="header">Join the Leaderboard</h1>
            <p class="description" v-if="!showLoginButton">
                Use your novo email below, to receive a signin link
            </p>
            <p class="description" v-else>
                Click the button below to complete your login
            </p>
            
            <div v-if="!showLoginButton">
                <input class="inputField" type="email" placeholder="Your email" v-model="email" />
            </div>
            
            <div v-if="!showLoginButton">
                <input type="submit" class="button block" 
                       :value="loading ? 'Loading' : 'Send magic link'"
                       @click.prevent="handleLogin"
                       :disabled="loading" />
            </div>
            
            <div v-if="showLoginButton">
                <button class="button block" @click.prevent="handleTokenLogin" :disabled="loading">
                    {{ loading ? 'Logging in...' : 'Complete Login' }}
                </button>
            </div>
            
            <div>
                <NuxtLink to="/" class="button block secondary" style="margin-top: 10px; text-align: center;">
                    Back to Rankings
                </NuxtLink>
            </div>
        </div>
    </form>
</template>

<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref("")
const token = ref("")
const showLoginButton = ref(false)

// Check URL parameters on component mount
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token')
    const urlEmail = urlParams.get('email')
    console.log("URL Token:", urlToken)
    console.log("URL Email:", urlEmail) 
    if (urlToken && urlEmail) {
        token.value = urlToken
        email.value = urlEmail
        showLoginButton.value = true
    }
})

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({ email: email.value })
        if (error) throw error
        alert("Check your email for the login link!")
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

const handleTokenLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.verifyOtp({
            email: email.value,
            token: token.value,
            type: 'magiclink'
        })
        
        if (error) throw error
        
        // Redirect after successful login
        navigateTo('/')
    } catch (error) {
        alert(error.message)
        showLoginButton.value = false
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
    display: block;
    text-decoration: none;
    padding: 10px;
}

.button.secondary:hover {
    background-color: #e5e5e5;
}
</style>
