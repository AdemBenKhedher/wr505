<template>
  <div>
    <h2>Liste des Films</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul v-else>
      <li v-for="movie in movies" :key="movie.id">
        <p>Titre : {{ movie.title }}</p>
        <p>Description : {{ movie.description }}</p>
        <p>Date de sortie : {{ movie.releaseDate }}</p>
        <p>Durée : {{ movie.duration }} minutes</p>
        <p>Réalisateur : {{ movie.director }}</p>
        <p>Note : {{ movie.rating }}</p>
        <img :src="movie.media" alt="Affiche du film" />
        <button @click="goToDetails(movie.id)">Voir détails</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [], // Pour stocker les films récupérés
      errorMessage: null // Pour gérer et afficher une erreur potentielle
    };
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
    fetchMovies() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then((response) => response.json()) // Transformer la réponse en JSON
        .then((result) => {
          this.movies = result.member; // Stocker les films dans le tableau 'movies'
          console.log("Films récupérés :", this.movies);
        })
        .catch((error) => {
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
ul {
  list-style-type: none;
}

li {
  margin-bottom: 10px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
