<template>
  <div class="movie-card" @click="$emit('click')">
    <img :src="movie.posterUrl" :alt="movie.title" class="movie-poster">
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-year">{{ movie.releaseYear }}</p>
      <div class="movie-rating">
        <span class="star">★</span>
        {{ movie.rating.toFixed(1) }}
      </div>
      <p class="movie-genre">{{ movie.genre }}</p>
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
  }
}
</script>

<style scoped>
.movie-card {
  width: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 12px;
}

.movie-title {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.movie-year {
  margin: 4px 0;
  color: #666;
}

.movie-rating {
  display: flex;
  align-items: center;
  margin: 4px 0;
}

.star {
  color: gold;
  margin-right: 4px;
}

.movie-genre {
  margin: 4px 0 0;
  font-size: 0.9em;
  color: #444;
}
</style>