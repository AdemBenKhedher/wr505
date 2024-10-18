<!-- SearchComponent.vue -->
<template>
    <div>
      <form @submit.prevent="performSearch">
        <label for="search">Rechercher {{ searchLabel }} :</label>
        <input 
          id="search" 
          v-model="query" 
          type="text" 
          :placeholder="`Rechercher ${searchLabel}`" 
        />
        <button type="submit">Rechercher</button>
      </form>
  
      <div v-if="filteredItems.length">
        <ul>
          <li v-for="item in filteredItems" :key="item.id">{{ item.name }}</li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun résultat trouvé.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      searchLabel: {
        type: String,
        default: 'éléments'
      }
    },
    data() {
      return {
        query: ''
      };
    },
    computed: {
      filteredItems() {
        if (!this.query) return this.items;
        return this.items.filter(item => 
          item.name.toLowerCase().includes(this.query.toLowerCase())
        );
      }
    },
    methods: {
      performSearch() {
        console.log(`Recherche effectuée pour: ${this.query}`);
      }
    }
  };
  </script>
  