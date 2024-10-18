<template>
  <div>
    <h2>Liste des Acteurs</h2>

    <!-- Display error message if any -->
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <!-- Search input (no button needed) -->
    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un Acteur" 
    />

    <!-- Actor list -->
    <ul v-if="filteredActors.length">
      <ActorCard
        v-for="actor in filteredActors"
        :key="actor.id"
        :actor="actor"
      />
    </ul>

    <!-- No actors found message -->
    <div v-else>
      <p>Aucun acteur trouvé.</p>
    </div>
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
      actors: [], // To store fetched actors
      errorMessage: null, // To handle any error messages
      query: "", // Search query for filtering actors
    };
  },
  computed: {
    // Computed property to filter actors based on search query
    filteredActors() {
      if (!this.query) return this.actors; // If query is empty, return all actors
      return this.actors.filter(actor =>
        actor.lastname && actor.lastname.toLowerCase().includes(this.query.toLowerCase())
      ); // Filter actors based on the query
    }
  },
  methods: {
    fetchActors() {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { 
          Authorization: `Bearer ${token}` // Add Authorization header
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
        .then(response => response.json()) // Parse the response as JSON
        .then(result => {
          this.actors = result.member; // Store fetched actors
          console.log("Acteurs récupérés :", this.actors); // Log the actors
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des acteurs :", error);
          this.errorMessage = "Impossible de récupérer les acteurs."; // Set error message
        });
    }
  },
  created() {
    this.fetchActors(); // Fetch actors when the component is mounted
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

input {
  margin-bottom: 20px;
  padding: 8px;
  font-size: 16px;
}
</style>
