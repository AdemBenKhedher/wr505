
<script>
  export default {
    data() {
      return {
        categories: [], // Pour stocker les catégories récupérées
        errorMessage: null // Pour gérer et afficher une erreur potentielle
      };
    },
    methods: {
      fetchCategories() {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
  
        fetch("http://symfony.mmi-troyes.fr:8319/api/categories", requestOptions)
          .then((response) => response.json()) // Transformer la réponse en JSON
          .then((result) => {
            this.categories = result.member; // Stocker les catégories dans le tableau 'categories'
            console.log("Catégories récupérées :", this.categories);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des catégories :", error);
            this.errorMessage = "Impossible de récupérer les catégories.";
          });
      }
    },
    created() {
      this.fetchCategories(); // Appeler la méthode lorsque le composant est monté
    }
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  </style>
  <template>
    <div>
      <h2>Liste des Catégories</h2>
      <div v-if="errorMessage">{{ errorMessage }}</div>
      <ul v-else>
        <li v-for="category in categories" :key="category.id">
          <p>Catégorie : {{ category.title }}</p>
          <p>Date de création : {{ category.createdAt }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  