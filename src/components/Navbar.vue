<script setup>
</script>

<template>
  <div id="navbar">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/movies">Movies</router-link></li>
        <li><router-link to="/actors">Actors</router-link></li>
        <li><router-link to="/categories">Categories</router-link></li>
        <li class="profile">
          <router-link to="/profile">Edit Profile</router-link> /
          <router-link to="/logout">Logout</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>

</style>
