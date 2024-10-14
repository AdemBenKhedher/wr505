
<template>
  <div>
    <h2>Liste des Acteurs</h2>
        <p>Prénom : {{ actor.firstname }}</p>
        <p>Nom : {{ actor.lastname }}</p>
        <p>Date de naissance : {{ actor.dob }}</p>
        <p>Nationalité : {{ actor.nationalty }}</p>
        <p>Récompenses : {{ actor.awards }}</p>
        <img :src="actor.media" alt="Image de l'acteur" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      actor: {}
    };
  },
  created() {
    const actorId = this.$route.params.id;
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.actor = result;
        console.log("Détails du film récupérés :", this.actor);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails du film :", error);
        this.errorMessage = "Impossible de récupérer les acteurs.";

      });
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
