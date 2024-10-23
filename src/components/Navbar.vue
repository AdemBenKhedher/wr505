<script setup>
</script>
<style>
#navbar {
  background-color: #333;
  padding: 10px 0;
  font-family: Arial, sans-serif;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

nav ul li {
  display: inline-block;
}

nav ul li a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

nav ul li a:hover {
  background-color: #555;
}

.profile {
  margin-left: auto;
}

.profile a {
  font-size: 0.9em;
  padding: 8px 12px;
}

/* Style spécifique pour le lien de connexion */
.profile a:last-child {
  background-color: #4CAF50;
  margin-left: 10px;
}

.profile a:last-child:hover {
  background-color: #45a049;
}

/* Media query pour la responsivité */
@media screen and (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: stretch;
  }

  nav ul li {
    margin-bottom: 10px;
  }

  .profile {
    margin-left: 0;
    text-align: center;
  }
}</style>
<template>
  <div id="navbar">
    <div v-if="this.$route.path === '/login'">
      <router-link to="/login">Login</router-link>
    </div>
    <nav v-else-if="isAuthenticated">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/movies">Movies</router-link></li>
        <li><router-link to="/actors">Actors</router-link></li>
        <li><router-link to="/categories">Categories</router-link></li>
        <li class="profile">
          <router-link to="/profile">Edit Profile</router-link> /
          <a href="#" @click.prevent="logout">Logout</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem('token'), // Retrieve the token initially
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.token; // Returns true if the token exists
    },

  },




  
  methods: {
    logout() {
      localStorage.removeItem('token'); // Remove the token
      this.token = null; // Update local state
      this.$router.push('/login'); // Redirect to login
    },
  },
  created() {
    this.token = localStorage.getItem('token');
  },
};
</script>
