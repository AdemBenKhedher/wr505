
<template>
  <div>
    <h2>Liste des Acteurs</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul v-else>
        <ActorCard
        v-for="actor in actors"
        :key="actor.id"
        :actor="actor"
      />
      
    </ul>
  </div>
</template>
<script>
import ActorCard from "@/components/ActorCard.vue";
export default {
  components: {
    ActorCard
  },
  data() {
    return {
      actors: [], // pour stocker les acteurs récupérés
      errorMessage: null // pour gérer et afficher une erreur potentielle
    };
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'actor-details', params: { id } });
    },
    fetchActors() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
        .then((response) => response.json()) // Transformer la réponse en JSON
        .then((result) => {
          this.actors = result.member; // Stocker les acteurs dans le tableau 'actors'
          console.log("Acteurs récupérés :", this.actors);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des acteurs :", error);
          this.errorMessage = "Impossible de récupérer les acteurs.";
        });
    }
  },
  created() {
    this.fetchActors(); // Appeler la méthode lorsque le composant est monté
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

