<template>
  <div class="actor-list">
    <h2>Liste des Acteurs</h2>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <div class="search-add">
      <div class="search-bar">
        <label for="search">Rechercher :</label>
        <input
          id="search"
          v-model="query"
          type="text"
          placeholder="Entrez le nom d'un Acteur"
        />
      </div>
      <div>
    <!-- Votre contenu principal -->
    <button @click="showModal = true">Add Actor</button>

    <Teleport to="body">
      <ActorModal v-if="showModal" @addActor="handleAddActor" @close="showModal = false" />
    </Teleport>
  </div>    </div>
    

    
    <div class="actor-grid">
      <ActorCard
        v-for="actor in paginatedActors"
        :key="actor.id"
        :actor="actor"
        @edit="showEditModal(actor)"
        @delete="deleteActor(actor.id)"
      />
    </div>
    
    <div v-if="paginatedActors.length === 0 && !errorMessage" class="no-results">
      <p>Aucun acteur trouvé.</p>
    </div>
    
    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
    
    <ActorModal
      v-if="isModalVisible"
      :actor="selectedActor"
      @close="closeModal"
      @save="saveActor"
    />
  </div>
</template>



<script>
import ActorCard from "@/components/ActorCard.vue";
import ActorModal from "@/components/ActorModal.vue"; // Modal for add/edit

export default {
  components: {
    ActorCard,
    ActorModal
  },
  data() {
    return {
      actors: [], 
      errorMessage: null, 
      query: "", 
      currentPage: 1,
      limit: 8,
      isModalVisible: false,  // Controls modal visibility
      selectedActor: null,  // Actor data for edit
      showAddModal: false, 
      showModal: false,
      // Show add modal
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
    handleAddActor(actor) {
      // Traitez les données de l'acteur ici
      console.log('New actor:', actor)
      this.showModal = false
    },
    fetchActors() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      };

      fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
        .then(response => response.json()) 
        .then(result => {
          this.actors = result.member;
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des acteurs :", error);
          this.errorMessage = "Impossible de récupérer les acteurs."; 
        });
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.currentPage = page; 
    },
    showAddModal() {
      this.selectedActor = null; // Reset to add mode
      this.isModalVisible = true;
    },
    showEditModal(actor) {
      this.selectedActor = actor; // Edit mode with selected actor
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false; // Close modal
    },
    saveActor(actor) {
      if (this.selectedActor) {
        // Update actor
        this.updateActor(actor);
      } else {
        // Create new actor
        this.addActor(actor);
      }
    },
    addActor(actor) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    const raw = JSON.stringify({
      lastname: actor.lastname,
      firstname: actor.firstname,
      dob: actor.dob,
      nationalty: actor.nationalty,
      awards: actor.awards,
      bio: actor.bio,  // Added bio field
      gender: actor.gender
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
      .then((response) => response.json())  // Parse the response as JSON
      .then((result) => {
        console.log("Actor added:", result);  // Check if the actor is added
        this.actors.push(result);  // Update the actor list
        this.closeModal();  // Close modal after success
      })
      .catch((error) => {
        console.error("Error adding actor:", error);
      });
  },
    updateActor(actor) {
      const token = localStorage.getItem('token');
      fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actor.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lastname: actor.lastname,
          firstname: actor.firstname,
          dob: actor.dob,
          nationalty: actor.nationalty,
          awards: actor.awards,
          bio: actor.bio,  // Added bio field
          gender: actor.gender
        })
      })
      .then(() => {
        this.fetchActors(); // Refresh the list
        this.closeModal();
      });
    },
    deleteActor(actorId) {
      const token = localStorage.getItem('token');
      fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        this.actors = this.actors.filter(actor => actor.id !== actorId); // Remove from list
      });
    }
  },
  created() {
    this.fetchActors();
  }
};
</script>



<style scoped>
.actor-list {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.error-message {
  color: #ff0000;
  margin-bottom: 10px;
}

.search-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar label {
  margin-right: 10px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #45a049;
}

.actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #008CBA;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #007B9A;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.modal h3 {
  margin-top: 0;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal label {
  margin-top: 10px;
}

.modal input,
.modal textarea {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-buttons button {
  margin-left: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button.save {
  background-color: #4CAF50;
  color: white;
}

.modal-buttons button.cancel {
  background-color: #f44336;
  color: white;
}
</style>