// src/router.js
import Vue from 'vue';
import Home from './components/Home.vue';
import Movies from './components/Movies.vue';
import Actors from './components/Actors.vue';
import Categories from './components/Categories.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', // Utilise l'historique du navigateur pour une navigation propre
  routes: [
    { path: '/', component: Home },
    { path: '/movies', component: Movies },
    { path: '/actors', component: Actors },
    { path: '/categories', component: Categories },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile },
    { path: '*', redirect: '/' } // Redirige vers la home si la route n'existe pas
  ]
});
