<!-- ActorDetails.vue -->
<template>
  <div class="actor-details" v-if="actor">
    <h1>{{ actor.name }}</h1>
    <p>{{ actor.bio }}</p>
    <!-- Add other actor details here -->
    
    <h2>Filmography</h2>
    <div class="movie-grid">
      <MovieCard 
        v-for="movie in actor.movies" 
        :key="movie.id" 
        :movie="movie"
        @click="goToMovieDetails(movie.id)"
      />
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      actor: null
    }
  },
  methods: {
    goToMovieDetails(movieId) {
      this.$router.push({ name: 'MovieDetails', params: { id: movieId } });
    },
    async fetchActorDetails() {
      // Fetch the actor details from your API
      // This is a placeholder implementation
      const actorId = this.$route.params.id;
      this.actor = await fetch(`/api/actors/${actorId}`).then(res => res.json());
    }
  },
  mounted() {
    this.fetchActorDetails();
  }
}
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}
</style>