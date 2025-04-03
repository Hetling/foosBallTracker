<template>
    <form class="row flex flex-center" @submit.prevent="handleSignin">
        <div class="col-6 form-widget">
            <h1 class="header">Sign In</h1>
            <p class="description">Click the button below to sign in</p>
            <button class="button secondary" :disabled="loading" @click="handleSignin">Sign In</button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);

const handleSignin = async () => {
    loading.value = true;
    
    // Extract confirmation URL from the current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const confirmationURL = urlParams.get('confirmation_url');
    const siteURL = "foos-ball-tracker.vercel.app"; // Replace with actual site URL
    
    if (confirmationURL) {
        window.location.href = `${siteURL}/confirm-signup?confirmation_url=${confirmationURL}`;
    } else {
        console.error("No confirmation URL found in parameters");
    }
};
</script>

<style scoped>
.button.secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    display: block;
    text-decoration: none;
    padding: 10px;
    cursor: pointer;
}

.button.secondary:hover {
    background-color: #e5e5e5;
}

.button.secondary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
