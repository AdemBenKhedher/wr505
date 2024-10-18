<template>
  <div>
    <h2>Liste des Derniers Acteurs</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul v-else>
      <ActorCard
        v-for="actor in recentActors"
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
      actors: [], 
      errorMessage: null 
    };
  },
  computed: {
    recentActors() {
    const sortedActors = this.actors
      .filter(actor => actor.id != null) 
      .sort((a, b) => b.id - a.id); 

    
    return sortedActors.slice(0, 4);
    }
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'actor-details', params: { id } });
    },
    fetchActors() {
      const token = localStorage.getItem('token');

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
        .then((response) => response.json()) 
        .then((result) => {
          this.actors = result.member;
          console.log("Acteurs récupérés :", this.actors);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des acteurs :", error);
          this.errorMessage = "Impossible de récupérer les acteurs.";
        });
    }
  },
  created() {
    this.fetchActors(); 
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
