<template>
	<div>
		<header class="header">
			<div class="header-content">
				<div class="header-left">
					<h1>FoosBall Rankings</h1>
					<button v-if="showBackButton" @click="goBack" class="back-button">← Back</button>
				</div>
				<NuxtLink v-if="user" to="/account" class="account-button">Account</NuxtLink>
			</div>
		</header>
		<div class="container" style="padding: 50px 0 100px 0">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser()

const showBackButton = computed(() => {
  // Don't show back button on the root page
  return route.path !== '/';
});

const goBack = () => {
  router.go(-1); // Go back one page in history
};

useHead({
	title: 'FoosBall Rankings'
})
</script>

<style>
.header {
  text-align: center;
  padding: 20px;
  position: relative;
}

.header-content {
  display: flex;
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.header-left {
  text-align: left;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  margin-top: 5px;
}

.back-button:hover {
  text-decoration: underline;
}

.account-button {
  position: absolute;
  right: 10px;
  color: inherit;
}

.account-button:hover {
  text-decoration: underline;
}
</style>
