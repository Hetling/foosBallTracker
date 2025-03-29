<template>
    <form class="row flex flex-center" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h1 class="header">Supabase + Vue 3</h1>
            <p class="description">Sign in via magic link with your email below</p>
            <div>
                <input class="inputField" type="email" placeholder="Your email" v-model="email" />
            </div>
            <div>
                <input type="submit" class="button block" :value="loading ? 'Loading' : 'Send magic link'"
                    :disabled="loading" />
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
