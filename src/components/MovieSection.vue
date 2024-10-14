<!-- MovieSection.vue -->
<template>
    <section class="movie-section">
      <h2>Recent Movies</h2>
      <div class="movie-grid">
        <MovieCard 
          v-for="movie in recentMovies" 
          :key="movie.id" 
          :movie="movie"
          @click="goToMovieDetails(movie.id)"
        />
      </div>
    </section>
  </template>
  
  <script>
  import MovieCard from './MovieCard.vue';
  
  export default {
    components: {
      MovieCard
    },
    data() {
      return {
        recentMovies: [] // This will be populated with the 4 most recent movies
      }
    },
    methods: {
      goToMovieDetails(movieId) {
        this.$router.push({ name: 'MovieDetails', params: { id: movieId } });
      },
      async fetchRecentMovies() {
        // Fetch the 4 most recent movies from your API
        // This is a placeholder implementation
        this.recentMovies = await fetch('/api/recent-movies?limit=4').then(res => res.json());
      }
    },
    mounted() {
      this.fetchRecentMovies();
    }
  }
  </script>
  
  <style scoped>
  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  </style>