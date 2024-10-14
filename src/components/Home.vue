<template>
    <div class="home">
      <h1>Welcome to our Movie Database</h1>
      <MovieSection />
      <ActorSection />
    </div>
  </template>
  
  <script>
  import MovieSection from '@/components/MovieSection.vue'
  import ActorSection from '@/components/ActorSection.vue'
  
  export default {
    name: 'Home',
    components: {
      MovieSection,
      ActorSection
    }
  }
  </script>