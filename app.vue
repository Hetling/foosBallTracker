<template>
	<div>
		<header class="header">
			<h1>Tournament Rankings</h1>
			<NuxtLink to="/account" class="account-button">Account</NuxtLink>
		</header>
		<div class="container" style="padding: 50px 0 100px 0">
			<NuxtPage />
		</div>
	</div>
</template>

<script setup>
useHead({
	title: 'Tournament Rankings'
})
</script>

<style>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	background-color: #f5f5f5;
	border-bottom: 1px solid #e0e0e0;
}

.account-button {
	padding: 0.5rem 1rem;
	background-color: #4CAF50;
	color: white;
	text-decoration: none;
	border-radius: 4px;
}

.account-button:hover {
	background-color: #45a049;
}
</style>
