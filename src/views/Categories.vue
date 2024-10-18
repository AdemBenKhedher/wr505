<template>
  <div>
    <h2>Liste des Catégories</h2>

    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Rechercher par titre" 
    />

    <div v-if="errorMessage">{{ errorMessage }}</div>

    <ul v-else>
      <li v-for="category in paginatedCategories" :key="category.id">
        <p>Catégorie : {{ category.title }}</p>
        <p>Date de création : {{ category.createdAt }}</p>
      </li>
    </ul>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [], 
      errorMessage: null, 
      searchQuery: "", 
      currentPage: 1,
      limit: 5 
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
        category.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.limit); 
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.limit;
      return this.filteredCategories.slice(start, start + this.limit); 
    }
  },
  methods: {
    fetchCategories() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/categories", requestOptions)
        .then(response => response.json()) 
        .then(result => {
          this.categories = result.member; 
          console.log("Catégories récupérées :", this.categories);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des catégories :", error);
          this.errorMessage = "Impossible de récupérer les catégories.";
        });
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.currentPage = page;
    }
  },
  created() {
    this.fetchCategories(); 
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

.pagination {
  margin-top: 20px; /* Espace au-dessus des boutons de pagination */
  display: flex;
  justify-content: center; /* Centrer les boutons de pagination */
}

button {
  margin: 0 5px; /* Espacement entre les boutons */
}
</style>
