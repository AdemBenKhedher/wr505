<template>
  <div class="movie-card" @mouseover="isHovered = true" @mouseleave="isHovered = false">
    <!-- Movie Poster Container -->
    <div class="poster-container">
      <img 
        v-if="movie.media" 
        :src="movie.media" 
        :alt="movie.title" 
        class="movie-poster" 
        :class="{ 'poster-hover': isHovered }"
      />
      <div v-else class="movie-poster-placeholder">
        <span class="placeholder-text">{{ movie.title }}</span>
      </div>
      
      <!-- Play Button Overlay -->
      <div v-if="isHovered" class="play-overlay">
        <button class="play-button" aria-label="Voir les détails">
          <svg class="play-icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      
      <!-- Movie Rating if available -->
      <div v-if="movie.rating" class="movie-rating">
        <span>{{ movie.rating }}</span>
      </div>
    </div>

    <!-- Expanded Content on Hover -->
    <div class="movie-content" :class="{ 'content-expanded': isHovered }">
      <div class="content-header">
        <h2 class="movie-title">{{ movie.title }}</h2>
        <div class="movie-meta">
          <span class="director">Par {{ movie.director }}</span>
        </div>
      </div>

      <div class="content-body">
        <p class="movie-description">{{ truncateDescription(movie.description) }}</p>
        
        <!-- Categories -->
        <div class="categories-container">
          <div class="categories">
            <span
              v-for="category in movie.categories"
              :key="category.id"
              :class="['category-tag', category.title]"
            >
              {{ category.title }}
            </span>
          </div>
        </div>

        <!-- Cast -->
        <div class="cast-container">
          <h3 class="cast-title">Casting</h3>
          <div class="cast-list">
            <span 
              v-for="actor in movie.actors" 
              :key="actor.id"
              class="actor-tag"
              @click.stop="goToActor(actor.id)"
            >
              {{ actor.firstname }} {{ actor.lastname }}
            </span>
          </div>
        </div>
      </div>

      <div class="content-footer">
        <button 
          @click.stop="goToDetails(movie.id)" 
          class="details-button"
        >
          Plus d'infos
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isHovered: false
    }
  },
  methods: {
    truncateDescription(description) {
      return description.length > 150 
        ? `${description.substring(0, 150)}...` 
        : description;
    },
    goToDetails(id) {
      this.$emit('view-details', id);
    },
    goToActor(id) {
      this.$emit('view-actor', id);
    },
    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
  }
}

</script>

<style scoped>
.movie-card {
  position: relative;
  width: 100%;
  background: #141414;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, z-index 0s 0.3s;
}

.movie-card:hover {
  transform: scale(1.2);
  z-index: 10;
  transition: transform 0.3s ease, z-index 0s;
}

/* Poster Styles */
.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  background: #2a2a2a;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.poster-hover {
  transform: scale(1.1);
}

.movie-poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
}

.placeholder-text {
  color: #ffffff;
  text-align: center;
  padding: 1rem;
  font-size: 1.1rem;
}

/* Play Button Overlay */
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.play-button:hover {
  transform: scale(1.1);
  background: #ffffff;
}

.play-icon {
  width: 24px;
  height: 24px;
  fill: #000000;
}

/* Rating Badge */
.movie-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Expanded Content */
.movie-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, #141414 80%, rgba(20, 20, 20, 0.9) 100%);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.content-expanded {
  transform: translateY(0);
}

.content-header {
  margin-bottom: 1rem;
}

.movie-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.movie-meta {
  font-size: 0.9rem;
  color: #a3a3a3;
}

.director {
  font-style: italic;
}

.movie-description {
  font-size: 0.9rem;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.4;
}

/* Categories */
.categories-container {
  margin-bottom: 1rem;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Cast */
.cast-container {
  margin-bottom: 1rem;
}

.cast-title {
  font-size: 0.9rem;
  color: #a3a3a3;
  margin-bottom: 0.5rem;
}

.cast-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.actor-tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(229, 9, 20, 0.2);
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.actor-tag:hover {
  background: rgba(229, 9, 20, 0.4);
}

/* Footer */
.content-footer {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.details-button {
  width: 100%;
  padding: 8px 16px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.details-button:hover {
  background: #ff0f1f;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .movie-card:hover {
    transform: scale(1.1);
  }

  .movie-content {
    padding: 0.8rem;
  }

  .movie-title {
    font-size: 1rem;
  }

  .movie-description {
    font-size: 0.8rem;
  }
}

/* Category-specific colors */
.action { background: rgba(255, 69, 0, 0.2); }
.drama { background: rgba(147, 112, 219, 0.2); }
.comedy { background: rgba(255, 215, 0, 0.2); }
.horror { background: rgba(128, 0, 0, 0.2); }
.scifi { background: rgba(0, 191, 255, 0.2); }
</style>
