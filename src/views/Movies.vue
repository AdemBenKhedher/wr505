<template>
  <div>
    <h2>Liste des Films</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    
    <form @submit.prevent="searchMovies">
      <label for="search">Rechercher :</label>
      <input id="search" v-model="query" type="text" placeholder="Entrez le nom d'un film" />
    </form>

    <ul v-if="movies.length">
      <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
    </ul>
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
    filteredMovies() {
      if (!this.query) return this.movies; // Si la requête est vide, retourner tous les films
      return this.movies.filter(movie => 
        movie.title.toLowerCase().includes(this.query.toLowerCase())
      ); // Filtrer les films en fonction de la requête
    }
  },
  methods: {
    fetchMovies() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Transformer la réponse en JSON
        })
        .then((result) => {
          this.movies = result.member; // Assurez-vous que `result.member` existe et est un tableau
          console.log("Films récupérés :", this.movies);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des films :", error);
          this.errorMessage = "Impossible de récupérer les films.";
        });
    },
    searchMovies() {
      // Optionnel : Ici, vous pouvez ajouter une logique si nécessaire lors de la recherche
      console.log(`Recherche pour: ${this.query}`);
    }
  },
  created() {
    this.fetchMovies(); // Appeler la méthode lorsque le composant est monté
  }
};
</script>

<style scoped>
</style>
