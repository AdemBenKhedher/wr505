<template>
  <div>
    <h2>Liste des Films</h2>

    
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <label for="search">Rechercher :</label>
    <input 
      id="search" 
      v-model="query" 
      type="text" 
      placeholder="Entrez le nom d'un film" 
    />
    
    <button @click="showAddMovieModal">Add Movie</button>

   
    <ul v-if="paginatedMovies.length">
  <li v-for="movie in paginatedMovies" :key="movie.id">
    <!-- Render the MovieCard component -->
    <MovieCard :movie="movie" />

    <!-- Edit and Delete buttons for each movie -->
    <button @click="editMovie(movie)">Edit</button>
    <button @click="confirmDeleteMovie(movie.id)">Delete</button>
  </li>
</ul>

    <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>{{ isEditMode ? 'Edit Movie' : 'Add Movie' }}</h2>

      <form @submit.prevent="isEditMode ? updateMovie() : addMovie()">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="movie.title" required>

        <label for="description">Description:</label>
        <textarea id="description" v-model="movie.description" required></textarea>

        <label for="release_date">Release Date:</label>
        <input type="date" id="release_date" v-model="movie.release_date" required>

        <label for="duration">Duration (mins):</label>
        <input type="number" id="duration" v-model="movie.duration" required>

        <label for="entries">Entries:</label>
        <input type="number" id="entries" v-model="movie.entries">

        <label for="director">Director:</label>
        <input type="text" id="director" v-model="movie.director" required>

        <label for="rating">Rating:</label>
        <input type="number" step="0.1" id="rating" v-model="movie.rating" required>

        <label for="media_id">Media ID:</label>
        <input type="number" id="media_id" v-model="movie.media_id" >

        <div class="modal-actions">
          <button type="submit">{{ isEditMode ? 'Update Movie' : 'Add Movie' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="deleteConfirmation" class="modal">
    <div class="modal-content">
      <p>Are you sure you want to delete this movie?</p>
      <div class="modal-actions">
        <button @click="deleteMovie(movie.id)">Yes, Delete</button>
        <button @click="deleteConfirmation = false">Cancel</button>
      </div>
    </div>
  </div>
   
    <div v-else>
      <p>Aucun film trouvé.</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<script>
import MovieCard from '../components/MovieCard.vue';

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      movies: [], 
      movie: {
      title: '',
      description: '',
      release_date: '',
      duration: 0,
      entries: 0,
      director: '',
      rating: 0,
      media_id: 1,
      createdAt: '',
      updatedAt: '',
    },
      errorMessage: null, 
      showModal: false,
      deleteConfirmation: false,
      isEditMode: false,
      query: '',
      currentPage: 1,
      limit: 15 
    };
  },
  computed: {

    filteredMovies() {
      if (!this.query) return this.movies;
      return this.movies.filter(movie => 
        movie.title && movie.title.toLowerCase().includes(this.query.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMovies.length / this.limit);
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.limit;
      return this.filteredMovies.slice(start, start + this.limit);
    }
  },
  methods: {
    fetchMovies() {
      const token = localStorage.getItem('token'); 
      const requestOptions = {
        method: "GET",
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        
      };
      fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(result => {
          this.movies = result.member || []; 
          console.log("Films récupérés :", this.movies);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des films :", error);
          this.errorMessage = "Impossible de récupérer les films.";
        });
    },
    addMovie() {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const newMovie = {
    title: this.movie.title,
    description: this.movie.description,
    release_date: this.movie.release_date,
    duration: parseInt(this.movie.duration, 10),
    entries: parseInt(this.movie.entries, 10),
    director: this.movie.director,
    rating: parseFloat(this.movie.rating),
    createdAt: formatDate(new Date()),
    updatedAt: formatDate(new Date()),
    media_id: this.movie.media_id, // assuming media_id is an integer or string ID
  };

  console.log('Payload being sent:', newMovie);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(newMovie),
  };

  fetch("http://symfony.mmi-troyes.fr:8319/api/movies", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du film');
      }
      return response.json();
    })
    .then(result => {
      console.log("Film ajouté :", result);
      this.resetMovie();
      this.fetchMovies();
      this.closeModal();
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout du film :", error);
    });
    },
    updateMovie() {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/merge-patch+json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const updatedMovie = {
    title: this.movie.title,
    description: this.movie.description,
    release_date: this.movie.release_date,
    duration: parseInt(this.movie.duration, 10),
    entries: parseInt(this.movie.entries, 10),
    director: this.movie.director,
    rating: parseFloat(this.movie.rating),
    createdAt: this.movie.createdAt,
    updatedAt: formatDate(new Date()),
    media_id: this.movie.media_id,
  };

  console.log('Payload update being sent:', updatedMovie);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify(updatedMovie),
  };

  fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${this.movie.id}`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du film');
      }
      return response.json();
    })
    .then(result => {
      console.log("Film modifié :", result);
      this.resetMovie();
      this.fetchMovies();
      this.closeModal();
      this.isEditMode = false;
    })
    .catch(error => {
      console.error("Erreur lors de la modification du film :", error);
      this.errorMessage = "Erreur lors de la modification du film.";
    });
    },
    editMovie(movie) {
      this.isEditMode = true;
      this.movie = { ...movie }; 
      this.showModal = true;
    },
    confirmDeleteMovie(movieId) {
    this.deleteConfirmation = true;
    this.movie.id = movieId;
    },
    deleteMovie(movieId) {
  const token = localStorage.getItem('token');
  fetch(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(() => {
    this.movies = this.movies.filter(movie => movie.id !== movieId);
    this.deleteConfirmation = false;
  })
  .catch(error => {
    console.error("Erreur lors de la suppression du film :", error);
  });
    },
    closeModal() {
      this.showModal = false;
      this.resetMovie();
    },
    resetMovie() {
  this.movie = {
    title: '',
    description: '',
    release_date: '',
    duration: 0,
    entries: 0,
    director: '',
    rating: 0,
    media_id: '',
    createdAt: '',
    updatedAt: '',
  };
    },
    showAddMovieModal() {
    this.isEditMode = false;
    this.resetMovie();
    this.showModal = true;
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.currentPage = page; 
    },

  },
  created() {
    this.fetchMovies();
  }
};
</script>

<style scoped>
.error {
  color: red; /* Couleur pour les messages d'erreur */
}
.movie-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-card {
  border: 1px solid #ddd;
  padding: 20px;
  width: 300px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  width: 500px;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

</style>
