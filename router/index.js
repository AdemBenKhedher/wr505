import Vue from 'vue';
import Router from 'vue-router';
import Home from '/src/components/Home.vue'; 
import Movies from '/src/components/Movies.vue';
import Actors from '/src/components/Actors.vue';
import Categories from '/src/components/Categories.vue';
import Login from '/src/components/Login.vue';
import Profile from '/src/components/Profile.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history', 
  routes: [
    { path: '/', redirect: '/home' }, 
    { path: '/home', component: Home },
    { path: '/movies', component: Movies },
    { path: '/actors', component: Actors },
    { path: '/categories', component: Categories },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile },
    { path: '*', redirect: '/' } 
  ]
});

export default router;