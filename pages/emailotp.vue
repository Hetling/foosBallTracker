<template>
    <form class="row flex flex-center" @submit.prevent="handleSignin">
        <div class="col-6 form-widget">
            <h1 class="header">Sign In</h1>
            <p class="description">Click the button below to sign in</p>
            <button class="button secondary" :disabled="loading" @click="handleSignin">Sign In</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const errorMessage = ref('');

const handleSignin = async () => {
    loading.value = true;
    errorMessage.value = ''; // Clear any previous error message
    
    // Extract confirmation URL from the current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    const { error } = await useSupabaseClient().auth.signInWithOtp({ token, email }

    );
    if (error) {
        errorMessage.value = error.message; // Set the error message
        alert(error.message);
    } else {
    }
    loading.value = false;
};
</script>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>

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
