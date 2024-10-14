<!-- ActorSection.vue -->
<template>
    <section class="actor-section">
      <h2>Recent Actors</h2>
      <div class="actor-grid">
        <ActorCard 
          v-for="actor in recentActors" 
          :key="actor.id" 
          :actor="actor"
          @click="goToActorDetails(actor.id)"
        />
      </div>
    </section>
  </template>
  
  <script>
  import ActorCard from './ActorCard.vue';
  
  export default {
    components: {
      ActorCard
    },
    data() {
      return {
        recentActors: [] // This will be populated with the 4 most recent actors
      }
    },
    methods: {
      goToActorDetails(actorId) {
        this.$router.push({ name: 'ActorDetails', params: { id: actorId } });
      },
      async fetchRecentActors() {
        // Fetch the 4 most recent actors from your API
        // This is a placeholder implementation
        this.recentActors = await fetch('/api/recent-actors?limit=4').then(res => res.json());
      }
    },
    mounted() {
      this.fetchRecentActors();
    }
  }
  </script>
  
  <style scoped>
  .actor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  </style>