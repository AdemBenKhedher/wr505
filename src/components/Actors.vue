

<script>
export default {
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
<template>
  <div>
    <h2>Liste des Acteurs</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul v-else>
      <li v-for="actor in actors" :key="actor.id">
        <p>Prénom : {{ actor.firstname }}</p>
        <p>Nom : {{ actor.lastname }}</p>
        <p>Date de naissance : {{ actor.dob }}</p>
        <p>Nationalité : {{ actor.nationalty }}</p>
        <p>Récompenses : {{ actor.awards }}</p>
        <button @click="goToDetails(actor.id)">Voir détails</button>

        <img :src="actor.media" alt="Image de l'acteur" />
      </li>
    </ul>
  </div>
</template>
