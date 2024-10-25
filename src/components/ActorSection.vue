<template>
  <section class="actor-section">
    <h2>Liste des Derniers Acteurs</h2>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div v-else class="content-slider">
      <!-- Navigation Buttons -->
      <button class="nav-button prev" @click="slide('prev')" aria-label="Previous">
        <span class="arrow">‹</span>
      </button>
      
      <div class="actors-container" ref="actorsContainer">
        <ActorCard
          v-for="actor in recentActors"
          :key="actor.id"
          :actor="actor"
          class="actor-item"
        />
      </div>
      
      <button class="nav-button next" @click="slide('next')" aria-label="Next">
        <span class="arrow">›</span>
      </button>
    </div>
  </section>
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

    
    return sortedActors.slice(0, 8);
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
    },    
    slide(direction) {
      const container = this.$refs.actorsContainer;
      const scrollAmount = container.clientWidth * 0.75;
      if (direction === 'prev') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  },
  created() {
    this.fetchActors(); 
  }
};
</script>
<style scoped>
.actor-section {
  margin: 3vw 0;
  position: relative;
}

h2 {
  font-size: 1.4vw;
  color: #e5e5e5;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-left: 4%;
}

.error-message {
  color: #e50914;
  padding: 1rem 4%;
  font-size: 1rem;
}

.content-slider {
  position: relative;
}

.actors-container {
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 1rem 4%;
  gap: 0.4vw;
}

.actors-container::-webkit-scrollbar {
  display: none;
}

.actor-item {
  flex: 0 0 auto;
  width: 12vw; /* Plus petit que les films pour avoir plus d'acteurs par ligne */
  transition: transform 0.3s ease;
}

.actor-item:hover {
  transform: scale(1.2);
  z-index: 2;
}

.nav-button {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.content-slider:hover .nav-button {
  opacity: 1;
}

.nav-button.prev {
  left: 0;
}

.nav-button.next {
  right: 0;
}

.arrow {
  color: #fff;
  font-size: 3rem;
  font-weight: bold;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

@media (max-width: 1400px) {
  .actor-item {
    width: 15vw;
  }
}

@media (max-width: 1100px) {
  .actor-item {
    width: 20vw;
  }
}

@media (max-width: 800px) {
  .actor-item {
    width: 25vw;
  }
  
  h2 {
    font-size: 1.2rem;
  }
}
</style>
