<template>
  <section class="movie-section">
    <h2>Liste des Derniers Films</h2>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div v-else class="content-slider">
      <!-- Navigation Buttons -->
      <button class="nav-button prev" @click="slide('prev')" aria-label="Previous">
        <span class="arrow">‹</span>
      </button>
      
      <div class="movies-container" ref="moviesContainer">
        <MovieCard
          v-for="movie in recentMovies"
          :key="movie.id"
          :movie="movie"
          class="movie-item"
        />
      </div>
      
      <button class="nav-button next" @click="slide('next')" aria-label="Next">
        <span class="arrow">›</span>
      </button>
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
      movies: [], 
      errorMessage: null 
    };
  },
  computed: {
    recentMovies() {
      const sortedMovies = this.movies
        .filter(movie => movie.id != null) 
        .sort((a, b) => b.id - a.id); 

      return sortedMovies.slice(0, 8);
    }
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
    fetchMovies() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then((response) => response.json()) 
        .then((result) => {
          this.movies = result.member; 
          console.log("movies récupérés :", this.movies);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des movies :", error);
          this.errorMessage = "Impossible de récupérer les movies.";
        });
    },
    slide(direction) {
      const container = this.$refs.moviesContainer;
      const scrollAmount = container.clientWidth * 0.75;
      if (direction === 'prev') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  },
  created() {
    this.fetchMovies(); 
  }
};
</script>

<style scoped>
.movie-section {
  margin: 3vw 0;
  position: relative;
}

h2 {
  font-size: 1.4vw;
  color: #e5e5e5;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-left: 4%;
}

.error-message {
  color: #e50914;
  padding: 1rem 4%;
  font-size: 1rem;
}

.content-slider {
  position: relative;
}

.movies-container {
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  padding: 1rem 4%;
  gap: 0.4vw;
}

.movies-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.movie-item {
  flex: 0 0 auto;
  width: 16vw; /* ~6 items per row */
  transition: transform 0.3s ease;
}

.movie-item:hover {
  transform: scale(1.3);
  z-index: 2;
}

.nav-button {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.content-slider:hover .nav-button {
  opacity: 1;
}

.nav-button.prev {
  left: 0;
}

.nav-button.next {
  right: 0;
}

.arrow {
  color: #fff;
  font-size: 3rem;
  font-weight: bold;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

@media (max-width: 1400px) {
  .movie-item {
    width: 20vw; /* ~5 items per row */
  }
}

@media (max-width: 1100px) {
  .movie-item {
    width: 25vw; /* ~4 items per row */
  }
}

@media (max-width: 800px) {
  .movie-item {
    width: 33.333vw; /* ~3 items per row */
  }
  
  h2 {
    font-size: 1.2rem;
  }
}
</style>
