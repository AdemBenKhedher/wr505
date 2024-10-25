<template>
  <div class="netflix-home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-gradient">
        <div class="hero-content">
          <h1>Welcome to our Movie Database</h1>
          <p class="hero-subtitle">Discover thousands of movies and actors</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="main-content">
      <MovieSection />
      <ActorSection />
    </div>
  </div>
</template>

<script>
import MovieSection from '@/components/MovieSection.vue'
import ActorSection from '@/components/ActorSection.vue'

export default {
  name: 'Home',
  components: {
    MovieSection,
    ActorSection
  }
}
</script>

<style scoped>
.netflix-home {
  min-height: 100vh;
  background-color: #141414;
  color: white;
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  height: 80vh;
  min-height: 600px;
  background-image: url('/api/placeholder/1920/1080');
  background-size: cover;
  background-position: center;
  margin-bottom: -100px;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 0.15) 15%,
    rgba(20, 20, 20, 0.35) 29%,
    rgba(20, 20, 20, 0.58) 44%,
    #141414 68%,
    #141414 100%
  );
}

.hero-content {
  position: absolute;
  bottom: 35%;
  left: 4%;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: normal;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
  color: #e5e5e5;
}

/* Main Content Styles */
.main-content {
  position: relative;
  z-index: 1;
  padding: 0 4%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
    min-height: 400px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>