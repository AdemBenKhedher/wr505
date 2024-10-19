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
        <button @click="$emit('edit')">Modifier</button>
        <button @click="$emit('delete')">Supprimer</button>
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
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    max-width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .actor-image {
    width: 100%;
    height: auto;
  }
  
  .actor-info {
    padding: 16px;
  }
  
  .actor-name {
    font-size: 1.5em;
    margin: 0 0 10px 0;
  }
  
  .actor-details {
    font-size: 0.9em;
    color: #555;
    margin-bottom: 12px;
  }
  
  .actor-awards {
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .details-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .details-button:hover {
    background-color: #0056b3;
  }
  </style>
  