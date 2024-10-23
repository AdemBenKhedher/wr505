<template>
  <div>
    <h2>Liste des Acteurs</h2>

    <div v-if="errorMessage">{{ errorMessage }}</div>

    <!-- Input de recherche -->
    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un Acteur" 
    />
    
    <!-- Bouton Ajouter un Acteur -->
    <button @click="showModal = true; resetActor()">Ajouter un Acteur</button>
    
    <!-- Modal pour Ajouter/Modifier un Acteur -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditMode ? 'Modifier' : 'Ajouter' }} un Acteur</h2>
        <form @submit.prevent="isEditMode ? updateActor() : addActor()">
          <div>
            <label for="actor-lastname">Nom de famille :</label>
            <input 
              type="text" 
              id="actor-lastname" 
              v-model="actor.lastname" 
              required 
            />
          </div>
          <div>
            <label for="actor-firstname">Prénom :</label>
            <input 
              type="text" 
              id="actor-firstname" 
              v-model="actor.firstname" 
              required 
            />
          </div>
          <div>
            <label for="actor-dob">Date de naissance :</label>
            <input 
              type="date" 
              id="actor-dob" 
              v-model="actor.dob" 
              required 
            />

            <label for="actor-doD">Date de mort :</label>
            <input 
              type="date" 
              id="actor-dod" 
              v-model="actor.dod" 
               
            />
          </div>
          <div>
            <label for="actor-nationalty">Nationalité :</label>
            <input 
              type="text" 
              id="actor-nationalty" 
              v-model="actor.nationalty" 
              required 
            />
          </div>
          <div>
            <label for="actor-awards">Récompenses :</label>
            <input 
              type="number" 
              id="actor-awards" 
              v-model="actor.awards" 
              required 
            />
          </div>
          <div>
            <label for="actor-gender">Genre :</label>
            <select id="actor-gender" v-model="actor.gender" required>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <button type="submit">{{ isEditMode ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Grid des acteurs -->
    <div class="actor-grid">
      <div v-for="actor in paginatedActors" :key="actor.id" class="actor-item">
        <ActorCard :actor="actor" />

        <!-- Boutons Modifier/Supprimer affichés au hover -->
        <div class="actor-item-buttons">
          <button @click="editActor(actor)">Modifier</button>
          <button @click="confirmDeleteActor(actor.id)">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Si aucun acteur n'est trouvé -->
    <div v-if="paginatedActors.length === 0 && !errorMessage">
      <p>Aucun acteur trouvé.</p>
    </div>

    <!-- Pagination -->
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
      actors: [
      
      ], 
      actor: {
        lastname: '',
        firstname: '',
        dob: '',
        dod: '',
        nationalty: '',
        awards: 0,
        gender: '',
        created_at: '', 
        
      },
      showModal: false,
      isEditMode: false,
      selectedActorId: null,
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
    },
    updateActor() {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
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
    const updatedActor = {
      lastname: this.actor.lastname,
      firstname: this.actor.firstname,

      nationalty: this.actor.nationalty,
      awards: parseInt(this.actor.awards, 10),
      gender: this.actor.gender,
    };
    console.log('Payload update being sent:', updatedActor);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(updatedActor),
    };
    fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${this.actor.id}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la modification de l\'acteur');
        }
        return response.json();
      })
      .then(result => {
        console.log("Acteur modifié :", result);
        this.resetActor(); // Réinitialiser les champs
        this.fetchActors(); // Rafraîchir la liste des acteurs
        this.closeModal(); // Fermer la modal
        this.isEditMode = false; // Désactiver le mode édition
      })
      .catch(error => {
        console.error("Erreur lors de la modification de l'acteur :", error);
        this.errorMessage = "Erreur lors de la modification de l'acteur.";
      });
  },
  editActor(actor) {
    this.isEditMode = true; // On active le mode édition
    this.actor = { ...actor }; // On pré-remplit la modal avec les informations de l'acteur
    this.showModal = true; // On affiche la modal
    this.selectedActorId = actor.id; // On stocke l'ID de l'acteur en cours d'édition
  },
    addActor() {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
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

  const newActor = {
    lastname: this.actor.lastname,
    firstname: this.actor.firstname,
    dob: this.actor.dob, 
    dod: this.actor.dod,
    nationalty: this.actor.nationalty,
    awards: parseInt(this.actor.awards, 10),
    gender: this.actor.gender,
    created_at: formatDate(new Date()),};

  console.log('Payload being sent:', newActor);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(newActor),
  };

  fetch("http://symfony.mmi-troyes.fr:8319/api/actors", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'acteur');
      }
      return response.json();
    })
    .then(result => {
      console.log("Acteur ajouté :", result);
      this.resetActor();
      this.fetchActors();
      this.closeModal();
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout de l'acteur :", error);
    });
},
  resetActor() {
      this.actor = {
        lastname: '',
        firstname: '',
        dob: '',
        dod: '',
        nationalty: '',
        awards: 0,
        gender: '',
        created_at: '',
      };
    },
    
    closeModal() {
      this.showModal = false; 
      this.resetActor(); 
      this.isEditMode = false;
    },
    


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
}

input {
font-size: 13px;
}

.pagination {
  margin-top: 20px; /* Space above pagination buttons */
  display: flex;
  justify-content: center; /* Center pagination buttons */
}

button {
  margin: 0 5px; /* Space between buttons */
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Assombrir l'arrière-plan */
  z-index: 1000; /* Placer au-dessus de tout */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 600px; /* Largeur de la modal */
  height: 88%; /* Hauteur de la modal */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease-out;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.actor-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.actor-item {
  position: relative;
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  transition: box-shadow 0.3s;
}

.actor-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.actor-item-buttons {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  gap: 10px;
}

.actor-item:hover .actor-item-buttons {
  display: flex;
}

.actor-item-buttons button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.actor-item-buttons button:hover {
  background-color: #2980b9;
}

.modal-content {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  position: relative;
}

.modal-content .close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.pagination {
  margin-top: 20px;
}
</style>