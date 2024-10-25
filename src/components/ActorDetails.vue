<template>
  <div class="actor-details-page">
    <!-- Loading State -->
    <div v-if="!actor.firstname" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Chargement des détails de l'acteur...</p>
    </div>

    <!-- Actor Details Content -->
    <div v-else class="actor-content">
      <!-- Hero Section -->
      <div class="hero-section" :style="{ backgroundImage: `url(${actor.media})` }">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="actor-full-name">{{ actor.firstname }} {{ actor.lastname }}</h1>
            <div class="actor-meta">
              <span class="meta-item">{{ actor.nationality }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-item">{{ actor.dob }}</span>
            </div>
            <div class="awards-section" v-if="actor.awards">
              <span class="awards-icon">🏆</span>
              <span class="awards-text">{{ actor.awards }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Biography Section -->
      <section class="biography-section">
        <div class="section-content">
          <div class="profile-grid">
            <div class="profile-image">
              <img :src="actor.media" :alt="`${actor.firstname} ${actor.lastname}`" class="actor-profile-image" />
            </div>
            <div class="profile-info">
              <h2 class="section-title">Informations</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nom complet</span>
                  <span class="info-value">{{ actor.firstname }} {{ actor.lastname }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date de naissance</span>
                  <span class="info-value">{{ actor.dob }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nationalité</span>
                  <span class="info-value">{{ actor.nationality }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filmography Section -->
      <section class="filmography-section">
        <div class="section-content">
          <h2 class="section-title">Filmographie</h2>
          <div class="movies-grid">
            <MovieCard
              v-for="movie in actorMovies"
              :key="movie.id"
              :movie="movie"
              class="movie-card-item"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { h } from 'vue';
import MovieCard from './MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      actor: {},
      actorMovies: [], 
    };
  },
  created() {
    const token = localStorage.getItem('token'); 
    const actorId = this.$route.params.id; 
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    
    fetch(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.actor = result; 
        console.log("Détails de l'acteur récupérés :", this.actor);

        
        this.fetchActorMovies(this.actor.movies); 
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails de l'acteur :", error);
        this.errorMessage = "Impossible de récupérer les détails de l'acteur.";
      });
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
    fetchActorMovies(movieIds) {
      const token = localStorage.getItem('token'); 
      const requests = movieIds.map(movieId => {

        return fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId.split('/').pop()}`, {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },}
      ) 
          .then(res => res.json());
      },

    );

      Promise.all(requests)
        .then(movies => {
          this.actorMovies = movies; 
          console.log("Films associés récupérés :", this.actorMovies);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des films associés :", error);
        });
    }
  }
};
</script>

<style scoped>
.actor-details-page {
  background-color: #141414;
  min-height: 100vh;
  color: white;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(229, 9, 20, 0.3);
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1rem;
  color: #a3a3a3;
}

/* Hero Section */
.hero-section {
  height: 70vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 0.5) 0%,
    rgba(20, 20, 20, 0.8) 60%,
    #141414 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 0 5% 5% 5%;
}

.hero-content {
  max-width: 800px;
}

.actor-full-name {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.actor-meta {
  font-size: 1.1rem;
  color: #a3a3a3;
  margin-bottom: 1rem;
}

.meta-separator {
  margin: 0 10px;
}

.awards-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e50914;
  font-size: 1.1rem;
}

/* Biography Section */
.biography-section {
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-image {
  position: relative;
}

.actor-profile-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: grid;
  gap: 0.3rem;
}

.info-label {
  color: #a3a3a3;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
}

/* Filmography Section */
.filmography-section {
  padding: 3rem 0;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.movie-card-item {
  transition: transform 0.3s ease;
}

.movie-card-item:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    height: 50vh;
  }

  .actor-full-name {
    font-size: 2.5rem;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-image {
    max-width: 250px;
    margin: 0 auto;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
