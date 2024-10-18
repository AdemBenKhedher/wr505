<template>
  <div>
    <div v-if="!movie.title">
      <p>Chargement des détails du film...</p>
    </div>
    <div v-else>
      <p>Titre : {{ movie.title }}</p>
      <p>Description : {{ movie.description }}</p>
      <p>Date de sortie : {{ movie.releaseDate }}</p>
      <p>Durée : {{ movie.duration }} minutes</p>
      <p>Réalisateur : {{ movie.director }}</p>
      <p>Note : {{ movie.rating }}</p>
      <img :src="movie.media" alt="Affiche du film" />
      
      <div v-if="actors.length">
        <h3>Acteurs associés :</h3>
        <ul>
          <ActorCard
        v-for="actor in actors"
        :key="actor.id"
        :actor="actor"
      />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ActorCard from "@/components/ActorCard.vue";
import { h } from "vue";
export default {
  components: {
    ActorCard
  },
  data() {
    return {
      movie: {}, 
      actors: [],
    };
  },
  created() {
    const token = localStorage.getItem('token'); 
    const movieId = this.$route.params.id;
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.movie = result;
        console.log("Détails du film récupérés :", this.movie);

        this.fetchMovieActors(this.movie.actors);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails du film :", error);
      });
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'actor-details', params: { id } });
    },
    fetchMovieActors(actorIds) {
      const token = localStorage.getItem('token'); 
      const requests = actorIds.map(actorId => {
        return fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId.split('/').pop()}`,{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        }})
          .then(res => res.json());
      });

      Promise.all(requests)
        .then(actors => {
          this.actors = actors; 
          console.log("Acteurs associés récupérés :", this.actors);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des acteurs associés :", error);
        });
    }
  }
};
</script>

<style scoped>
p {
  font-size: 16px;
  margin: 10px 0;
}

img {
  max-width: 100px;
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 20px;
}
</style>
