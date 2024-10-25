<template>
  <div class="movie-card">
    <img v-if="movie.media" :src="movie.media" :alt="movie.title" class="movie-poster" />
    <div v-else class="movie-poster"></div>

    <div class="movie-info">
      <h2 class="movie-title">{{ movie.title }}</h2>
      <h2 class="movie-director">Directed by : {{ movie.director }}</h2>
      <p class="movie-description">{{ movie.description }}</p>
      <button @click="goToDetails(movie.id)" class="btn btn-primary">More details</button>

      <div class="movie-details">
        <div class="categories">
          <span
            v-for="category in movie.categories"
            :key="category.id"
            :class="category.title"
            class="category-tag">
            {{ category.title }}
          </span>
        </div>

        <div class="actors">
          <span class="actor-tag" v-for="actor in movie.actors" :key="actor.id">
            {{ actor.firstname }} {{ actor.lastname }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object,
    
  },
  methods: {

    goToDetails(id) {
      this.$router.push({ name: 'movie-details', params: { id } });
    },
  },
};
</script>

<style scoped>

</style>
