<template>
  <div>
    <h2>Liste des Films</h2>

    <!-- Display error message if any -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- Search input (no button needed) -->
    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un film" 
    />

    <!-- Movie list -->
    <ul v-if="filteredMovies.length">
      <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
    </ul>

    <!-- No movies found message -->
    <div v-else>
      <p>Aucun film trouvé.</p>
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
      movies: [], // Pour stocker les films récupérés
      errorMessage: null, // Pour gérer et afficher une erreur potentielle
      query: '', // Pour la recherche de film
    };
  },
  computed: {
    // Computed property to filter movies based on the search query
    filteredMovies() {
      if (!this.query) return this.movies; // Si la requête est vide, retourner tous les films
      return this.movies.filter(movie => 
        movie.title && movie.title.toLowerCase().includes(this.query.toLowerCase())
      ); // Filtrer les films en fonction de la requête
    }
  },
  methods: {
    fetchMovies() {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
      const requestOptions = {
        method: "GET",
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      };
      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Transformer la réponse en JSON
        })
        .then(result => {
          this.movies = result.member || []; // Assurez-vous que `result.member` existe et est un tableau
          console.log("Films récupérés :", this.movies);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des films :", error);
          this.errorMessage = "Impossible de récupérer les films.";
        });
    }
  },
  created() {
    this.fetchMovies(); // Appeler la méthode lorsque le composant est monté
  }
};
</script>

<style scoped>
.error {
  color: red; /* Couleur pour les messages d'erreur */
}
</style>
