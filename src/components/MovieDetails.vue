<template>
  <div class="movie-details-page">
    <!-- Loading State -->
    <div v-if="!movie.title" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Chargement des détails du film...</p>
    </div>

    <div v-else class="movie-content">
      <!-- Hero Banner Section -->
      <div class="movie-hero" :style="{ backgroundImage: `url(${movie.media})` }">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="movie-title">{{ movie.title }}</h1>
            
            <div class="movie-meta">
              <span class="release-date">{{ formatDate(movie.releaseDate) }}</span>
              <span class="meta-separator">•</span>
              <span class="duration">{{ formatDuration(movie.duration) }}</span>
              <span class="meta-separator">•</span>
              <span class="rating">
                <span class="rating-star">★</span>
                {{ movie.rating }}/10
              </span>
            </div>

            <p class="movie-description">{{ movie.description }}</p>

            <div class="movie-credits">
              <p class="director">Un film de <span class="highlight">{{ movie.director }}</span></p>
            </div>

            <div class="action-buttons">
              <button class="play-button">
                <svg viewBox="0 0 24 24" class="play-icon">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Lecture
              </button>
              <button class="more-info-button">
                <svg viewBox="0 0 24 24" class="info-icon">
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Plus d'infos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <section class="details-section">
        <div class="container">
          <!-- Technical Details -->
          <div class="technical-details">
            <h2 class="section-title">À propos de {{ movie.title }}</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Date de sortie</span>
                <span class="detail-value">{{ formatDate(movie.releaseDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Durée</span>
                <span class="detail-value">{{ formatDuration(movie.duration) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Réalisateur</span>
                <span class="detail-value">{{ movie.director }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Note</span>
                <span class="detail-value">
                  <span class="rating-stars">
                    {{ "★".repeat(Math.floor(movie.rating)) }}
                    {{ "☆".repeat(5 - Math.floor(movie.rating)) }}
                  </span>
                  {{ movie.rating }}/10
                </span>
              </div>
            </div>
          </div>

          <!-- Cast Section -->
          <div v-if="actorsData.length" class="cast-section">
            <h2 class="section-title">Distribution</h2>
            <div class="actors-grid">
              <ActorCard
                v-for="actor in actorsData"
                :key="actor.id"
                :actor="actor"
                class="actor-card-item"
              />
              <ActorCard
                v-for="actor in actors"
                :key="actor.id"
                :actor="actor"
                class="actor-card-item"
              />
            
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import ActorCard from "@/components/ActorCard.vue";

export default {
  name: 'MovieDetails',
  components: {
    ActorCard
  },
  data() {
    return {
      movie: {},
      actorsData: [],
      actors: [],
      API_BASE_URL: 'http://symfony.mmi-troyes.fr:8319/api'
    };
  },
  methods: {
    async fetchMovieDetails(movieId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${this.API_BASE_URL}/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        this.movie = data;

        if (data.actorsData && Array.isArray(data.actorsData)) {
          await this.fetchMovieActors(data.actorsData);
          console.log(this.actorsData);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    },

    async fetchMovieActors(actorIds) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const requests = actorIds.map(actorId => {
          const id = typeof actorId === 'string' ? actorId.split('/').pop() : actorId;
          return fetch(`${this.API_BASE_URL}/actors/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json());
        });
        console.log(this.actorsData);
        this.actorsData = await Promise.all(requests);
        console.log(this.actorsData);
      } catch (error) {
        console.error("Error fetching associated actors:", error);
      }
    },

    goToDetails(id) {
      if (id) this.$router.push({ name: 'actor-details', params: { id } });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  },
  mounted() {
    const movieId = this.$route.params.id;
    if (movieId) this.fetchMovieDetails(movieId);
  }
};
</script>


<style scoped>
.movie-details-page {
  background-color: #141414;
  min-height: 100vh;
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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
.movie-hero {
  height: 85vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(20, 20, 20, 0.95) 0%,
    rgba(20, 20, 20, 0.7) 50%,
    rgba(20, 20, 20, 0.4) 100%
  );
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 650px;
  padding: 0 5%;
}

.movie-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #a3a3a3;
}

.meta-separator {
  color: #a3a3a3;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.rating-star {
  color: #e50914;
}

.movie-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.movie-credits {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.highlight {
  color: #e50914;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.play-button,
.more-info-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-button {
  background-color: #ffffff;
  color: #000000;
}

.play-button:hover {
  background-color: rgba(255, 255, 255, 0.75);
}

.more-info-button {
  background-color: rgba(109, 109, 110, 0.7);
  color: #ffffff;
}

.more-info-button:hover {
  background-color: rgba(109, 109, 110, 0.4);
}

.play-icon,
.info-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

/* Details Section */
.details-section {
  background-color: #141414;
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
}

/* Technical Details */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  color: #a3a3a3;
  font-size: 0.9rem;
}

.detail-value {
  font-size: 1.1rem;
}

.rating-stars {
  color: #e50914;
  margin-right: 0.5rem;
}

/* Cast Section */
.actorsData-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.actor-card-item {
  transition: transform 0.3s ease;
}

.actor-card-item:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .movie-hero {
    height: 70vh;
  }

  .hero-overlay {
    background: linear-gradient(
      to bottom,
      rgba(20, 20, 20, 0.7) 0%,
      rgba(20, 20, 20, 0.9) 70%,
      #141414 100%
    );
  }

  .hero-content {
    padding: 0 1rem;
    margin-top: auto;
    margin-bottom: 2rem;
  }

  .movie-title {
    font-size: 2.5rem;
  }

  .movie-description {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
