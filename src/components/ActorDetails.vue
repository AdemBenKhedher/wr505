<template>
  <div>
    <div v-if="!actor.firstname">
      <p>Chargement des détails de l'acteur...</p>
    </div>
    <div v-else>
      <h2>Détails de l'Acteur</h2>
      <p>Prénom : {{ actor.firstname }}</p>
      <p>Nom : {{ actor.lastname }}</p>
      <p>Date de naissance : {{ actor.dob }}</p>
      <p>Nationalité : {{ actor.nationalty }}</p>
      <p>Récompenses : {{ actor.awards }}</p>
      <img :src="actor.media" :alt="`${actor.firstname} ${actor.lastname}`" />
      <div>
        <h3>Films de l'acteur</h3>
        <ul>
          <MovieCard v-for="movie in actorMovies" :key="movie.id" :movie="movie" />

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
import MovieCard from './MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      actor: {},
      actorMovies: [], // Pour stocker les films associés
    };
  },
  created() {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
    const actorId = this.$route.params.id; // Récupérer l'ID de l'acteur
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Récupérer les détails de l'acteur
    fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.actor = result; // Stocker les détails de l'acteur
        console.log("Détails de l'acteur récupérés :", this.actor);

        // Récupérer les films associés
        this.fetchActorMovies(this.actor.movies); // Appeler la méthode pour récupérer les films
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails de l'acteur :", error);
        this.errorMessage = "Impossible de récupérer les détails de l'acteur.";
      });
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
    fetchActorMovies(movieIds) {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
      const requests = movieIds.map(movieId => {

        return fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId.split('/').pop()}`, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      ) // On récupère l'ID à partir de l'URL
          .then(res => res.json());
      },

    );

      Promise.all(requests)
        .then(movies => {
          this.actorMovies = movies; // Stocker les films associés
          console.log("Films associés récupérés :", this.actorMovies);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des films associés :", error);
        });
    }
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
