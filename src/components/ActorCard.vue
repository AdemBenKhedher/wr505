<template>
    <div class="actor-card">
      <img :src="actor.media" alt="Image de l'acteur" class="actor-image" />
      <div class="actor-info">
        <h2 class="actor-name">{{ actor.firstname }} {{ actor.lastname }}</h2>
        <p class="actor-details">
          <span>Date de naissance : {{ actor.dob }}</span> |
          <span>Nationalité : {{ actor.nationality }}</span>
        </p>
        <p class="actor-awards">Awards : {{ actor.awards }}</p>
        <button class="details-button" @click="goToDetails(actor.id)">Voir détails</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      actor: Object,
    },
    methods: {
      goToDetails(id) {
        this.$router.push({ name: 'actor-details', params: { id } });
      },
    },
  };
  </script>
  
  <style scoped>
 .actor-card {
  width: 280px;
  background: #141414;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.actor-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.actor-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.actor-card:hover .actor-image {
  opacity: 0.7;
}

.actor-info {
  padding: 16px;
  color: #ffffff;
  background: linear-gradient(to top, #141414, rgba(20, 20, 20, 0.8));
}

.actor-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #ffffff;
}

.actor-details {
  font-size: 0.9rem;
  color: #a3a3a3;
  margin: 8px 0;
}

.actor-details span {
  display: inline-block;
}

.actor-awards {
  font-size: 0.9rem;
  color: #e50914;
  margin: 8px 0;
}

.details-button {
  width: 100%;
  padding: 8px 16px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 12px;
}

.details-button:hover {
  background-color: #ff0f1f;
}

/* Pour créer une grille de cartes */
.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
  background-color: #141414;
}

/* Ajout de styles pour améliorer la lisibilité */
@media (max-width: 768px) {
  .actor-card {
    width: 100%;
  }
  
  .actor-image {
    height: 300px;
  }
}
  </style>
  