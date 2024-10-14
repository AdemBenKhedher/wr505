<template>
  <div>
    <p>Titre : {{ movie.title }}</p>
        <p>Description : {{ movie.description }}</p>
        <p>Date de sortie : {{ movie.releaseDate }}</p>
        <p>Durée : {{ movie.duration }} minutes</p>
        <p>Réalisateur : {{ movie.director }}</p>
        <p>Note : {{ movie.rating }}</p>
        <img :src="movie.media" alt="Affiche du film" />
    <!-- Affichez d'autres détails ici -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      movie: {}
    };
  },
  created() {
    const movieId = this.$route.params.id;
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.movie = result;
        console.log("Détails du film récupérés :", this.movie);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails du film :", error);
      });
  }
};
</script>
