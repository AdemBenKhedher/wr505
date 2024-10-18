<template>
  <div>
    <h2>Liste des movies</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul v-else>
      <MovieCard v-for="movie in recentMovies" :key="movie.id" :movie="movie" />
    </ul>
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
      movies: [], // Pour stocker les movies récupérés
      errorMessage: null // Pour gérer et afficher une erreur potentielle
    };
  },
  computed: {
    recentMovies() {
      const sortedMovies = this.movies
        .filter(movie => movie.id != null) // Filtrer les movies avec un ID valide
        .sort((a, b) => b.id - a.id); // Trie par ID décroissant

      // Retourne les 4 premiers movies après le tri
      return sortedMovies.slice(0, 4);
    }
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
    fetchMovies() {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then((response) => response.json()) // Transformer la réponse en JSON
        .then((result) => {
          this.movies = result.member; // Stocker les movies dans le tableau 'movies'
          console.log("movies récupérés :", this.movies);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des movies :", error);
          this.errorMessage = "Impossible de récupérer les movies.";
        });
    }
  },
  created() {
    this.fetchMovies(); // Appeler la méthode lorsque le composant est monté
  }
};
</script>

<style scoped>

</style>
