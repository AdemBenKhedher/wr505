<template>
  <div>
    <h2>Liste des Films</h2>

    
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un film" 
    />

   
    <ul v-if="paginatedMovies.length">
      <MovieCard v-for="movie in paginatedMovies" :key="movie.id" :movie="movie" />
    </ul>

   
    <div v-else>
      <p>Aucun film trouvé.</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
import MovieCard from '../components/MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      movies: [], 
      errorMessage: null, 
      query: '',
      currentPage: 1,
      limit: 15 
    };
  },
  computed: {

    filteredMovies() {
      if (!this.query) return this.movies;
      return this.movies.filter(movie => 
        movie.title && movie.title.toLowerCase().includes(this.query.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMovies.length / this.limit);
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.limit;
      return this.filteredMovies.slice(start, start + this.limit);
    }
  },
  methods: {
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.currentPage = page; 
    },
    fetchMovies() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        
      };
      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
          this.movies = result.member || []; 
          console.log("Films récupérés :", this.movies);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des films :", error);
          this.errorMessage = "Impossible de récupérer les films.";
        });
    }
  },
  created() {
    this.fetchMovies();
  }
};
</script>

<style scoped>
.error {
  color: red; /* Couleur pour les messages d'erreur */
}
</style>
