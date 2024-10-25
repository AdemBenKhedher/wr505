<template>
    <div class="modal-overlay" v-if="visible">
      <div class="modal">
        <h3>{{ actor ? 'Modifier l\'acteur' : 'Ajouter un acteur' }}</h3>
        <form @submit.prevent="saveActor">
          <label for="lastname">Nom :</label>
          <input
            id="lastname"
            v-model="localActor.lastname"
            type="text"
            required
          />
  
          <label for="firstname">Prénom :</label>
          <input
            id="firstname"
            v-model="localActor.firstname"
            type="text"
            required
          />
  
          <!-- Autres champs -->
          <label for="bio">Biographie :</label>
          <textarea
            id="bio"
            v-model="localActor.bio"
            rows="4"
          ></textarea>
  
          <!-- Boutons de confirmation et annulation -->
          <div class="modal-buttons">
            <button type="submit" class="save">Sauvegarder</button>
            <button type="button" class="cancel" @click="$emit('close')">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      actor: Object,
      visible: Boolean
    },
    data() {
      return {
        localActor: this.actor ? { ...this.actor } : this.getDefaultActor()
      };
    },
    methods: {
      getDefaultActor() {
        return {
          lastname: "",
          firstname: "",
          dob: "",
          nationalty: "",
          awards: "",
          bio: "",
          gender: ""
        };
      },
      saveActor() {
        this.$emit('save', this.localActor); // Émettre l'événement avec l'acteur à sauvegarder
      }
    },
    watch: {
      actor(newActor) {
        // Mettez à jour les données locales si l'acteur change
        this.localActor = newActor ? { ...newActor } : this.getDefaultActor();
      }
    }
  };
  </script>
  