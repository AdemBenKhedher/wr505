<template>
  <div class="add-category">
    <h2>Liste des Catégories</h2>
    <button @click="showModal = true; resetCategory()">Ajouter une Catégorie</button>

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
        <button @click="editCategory(category)">Modifier</button>
        <button @click="confirmDeleteCategory(category.id)">Supprimer</button>
      </li>
    </ul>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>

    <!-- Modal pour ajouter ou modifier une catégorie -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditMode ? 'Modifier' : 'Ajouter' }} une Catégorie</h2>
        <form @submit.prevent="isEditMode ? updateCategory() : addCategory()">
          <div>
            <label for="category-title">Titre :</label>
            <input 
              type="text" 
              id="category-title" 
              v-model="category.title" 
              required 
            />
          </div>
          <div>
            <button type="submit">{{ isEditMode ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>
    <div class="delete-modal" v-if="deleteConfirmation">
      <div class="delete-modal-content">
        <p class="delete-confirmation">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
        <div class="delete-buttons">
          <button @click="deleteCategory(selectedCategoryId)">Oui</button>
          <button @click="deleteConfirmation = false">Non</button>
        </div>
      </div>
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
      limit: 5, 
      showModal: false,
      deleteConfirmation: false,
      selectedCategoryId: null,
      isEditMode: false,
      category: {
        title: '',
      }
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
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/categories", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
          }
          return response.json(); 
        })
        .then(result => {
          this.categories = result.member; 
          console.log("Catégories récupérées :", this.categories);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des catégories :", error);
          this.errorMessage = "Impossible de récupérer les catégories.";
        });
    },
    addCategory() {
    const myHeaders = new Headers();
    const token = localStorage.getItem('token');
    myHeaders.append("Content-Type", "application/json"); // Modifié ici
    myHeaders.append("Authorization", `Bearer ${token}`);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const raw = JSON.stringify({
        title: this.category.title,
        createdAt: formatDate(new Date()),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    fetch("http://symfony.mmi-troyes.fr:8319/api/categories", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la catégorie');
            }
            return response.json();
        })
        .then(result => {
            console.log("Catégorie ajoutée :", result);
            this.resetCategory(); // Reset category data
            this.fetchCategories(); // Refresh category list
            this.closeModal(); // Close modal
        })
        .catch(error => {
            console.error("Erreur lors de l'ajout de la catégorie :", error);
            this.errorMessage = "Erreur lors de l'ajout de la catégorie.";
        });
    },
    updateCategory() {
      const myHeaders = new Headers();
      const token = localStorage.getItem('token');
      myHeaders.append("Content-Type", "application/merge-patch+json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

      const raw = JSON.stringify({
        title: this.category.title,
        updatedAt: formatDate(new Date()),
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
      };

      fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${this.selectedCategoryId}`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la modification de la catégorie');
          }
          return response.json();
        })
        .then(result => {
          console.log("Catégorie modifiée :", result);
          this.resetCategory();
          this.fetchCategories();
          this.closeModal();
          this.isEditMode = false;
        })
        .catch(error => {
          console.error("Erreur lors de la modification de la catégorie :", error);
          this.errorMessage = "Erreur lors de la modification de la catégorie.";
        });
    },
    editCategory(category) {
      this.isEditMode = true;
      this.category.title = category.title; // Load the selected category's title into the modal
      this.selectedCategoryId = category.id; // Store the ID for later use
      this.showModal = true; // Open modal
    },
    confirmDeleteCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.deleteConfirmation = true;
    },
    deleteCategory(categoryId) {
  const myHeaders = new Headers();
  const token = localStorage.getItem('token');
  myHeaders.append("Authorization", `Bearer ${token}`);

  // Étape 1 : Récupérer les détails de la catégorie pour vérifier les films associés
  fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`, {
    method: "GET",
    headers: myHeaders,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de la catégorie');
      }
      return response.json();
    })
    .then(data => {
      // Étape 2 : Vérifiez si la catégorie a des films associés
      const movies = data.movies || [];
      if (movies.length > 0) {
        this.deleteConfirmation = false; // Cacher la confirmation
        alert("Impossible de supprimer cette catégorie car elle est liée à un ou plusieurs films.");
        return; // Sortir de la fonction si des films sont associés
      }

      // Étape 3 : Si aucun film n'est associé, procédez à la suppression
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
      };

      return fetch(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`, requestOptions);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la catégorie');
      }
      return response.text();
    })
    .then(result => {
      console.log("Catégorie supprimée :", result);
      this.fetchCategories(); // Actualiser la liste des catégories
      this.deleteConfirmation = false; // Cacher la confirmation
    })
    .catch(error => {
      console.error("Erreur :", error);
      alert(error.message || "Erreur lors de l'opération.");
    });
},

    closeModal() {
      this.showModal = false; // Close modal
      this.resetCategory(); // Reset category data
      this.isEditMode = false; // Reset edit mode
    },
    resetCategory() {
      this.category.title = ''; // Reset the title for new category
      this.selectedCategoryId = null; // Clear selected category ID
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
.add-category {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button.delete {
  background-color: #f44336;
}

button.delete:hover {
  background-color: #d32f2f;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination span {
  margin: 0 10px;
}

.modal, .delete-modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content, .delete-modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.delete-modal-content {
  text-align: center;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.error-message {
  color: #ff0000;
  margin-top: 10px;
}

.delete-confirmation {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.delete-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.delete-buttons button {
  min-width: 80px;
}

.delete-buttons button:first-child {
  background-color: #f44336;
}

.delete-buttons button:first-child:hover {
  background-color: #d32f2f;
}

.delete-buttons button:last-child {
  background-color: #9e9e9e;
}

.delete-buttons button:last-child:hover {
  background-color: #757575;
}

.add-category {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination span {
  margin: 0 10px;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 500px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.error-message {
  color: #ff0000;
  margin-top: 10px;
}
</style>
