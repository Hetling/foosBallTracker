<template>
    <form class="row flex flex-center">
      <div class="col-6 form-widget">
        <h1 class="header">Join the Leaderboard</h1>
        <p class="description" v-if="!showLoginButton">
          Use your email below, to receive a signin link
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
      </div>
    </form>
  
    <ToastNotification 
      :show="showToast" 
      :message="toastMessage" 
      :type="toastType"
      @close="showToast = false"
    />
  </template>
  
  <script setup>
  const supabase = useSupabaseClient()
  
  const loading = ref(false)
  const email = ref("")
  const token = ref("")
  const showLoginButton = ref(false)
  
  // Toast state
  const showToast = ref(false)
  const toastMessage = ref("")
  const toastType = ref("info")
  
  const showNotification = (message, type = 'info') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
  
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
      showNotification("Check your email for the login link!", "success")
    } catch (error) {
      showNotification(error.message, "error")
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
      
      // Show success message before redirect
      showNotification("Login successful! Redirecting...", "success")
      
      // Short delay before redirect to allow user to see the message
      setTimeout(() => {
        navigateTo('/')
      }, 1000)
    } catch (error) {
      showNotification(error.message, "error")
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