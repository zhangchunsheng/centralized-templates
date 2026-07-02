<script setup>
import HeaderNav from './components/HeaderNav.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <HeaderNav />
    <main class="flex-1">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>
