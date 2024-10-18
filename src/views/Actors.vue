<template>
  <div>
    <h2>Liste des Acteurs</h2>

    <div v-if="errorMessage">{{ errorMessage }}</div>

    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un Acteur" 
    />

    <div class="actor-grid">
      <ActorCard
        v-for="actor in paginatedActors"
        :key="actor.id"
        :actor="actor"
      />
    </div>

    <div v-if="paginatedActors.length === 0 && !errorMessage">
      <p>Aucun acteur trouvé.</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
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
      actors: [], 
      errorMessage: null, 
      query: "", 
      currentPage: 1,
      limit: 4
    };
  },
  computed: {
   
    filteredActors() {
      if (!this.query) return this.actors; 
      return this.actors.filter(actor =>
        actor.lastname && actor.lastname.toLowerCase().includes(this.query.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredActors.length / this.limit); 
    },
    paginatedActors() {
      const start = (this.currentPage - 1) * this.limit;
      return this.filteredActors.slice(start, start + this.limit); 
    }
  },
  methods: {
    fetchActors() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
        .then(response => response.json()) 
        .then(result => {
          this.actors = result.member;
          console.log("Acteurs récupérés :", this.actors); 
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des acteurs :", error);
          this.errorMessage = "Impossible de récupérer les acteurs."; 
        });
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.currentPage = page; 
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

.actor-grid {
  display: grid; /* Enable grid layout */
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  gap: 16px; /* Space between grid items */
  margin-bottom: 20px; /* Space below the grid */
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

.pagination {
  margin-top: 20px; /* Space above pagination buttons */
  display: flex;
  justify-content: center; /* Center pagination buttons */
}

button {
  margin: 0 5px; /* Space between buttons */
}
</style>
