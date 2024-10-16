import Vue from 'vue';
import Router from 'vue-router';
import Home from '/src/views/Home.vue'; 
import Movies from '/src/views/Movies.vue';
import Actors from '/src/views/Actors.vue';
import Categories from '/src/views/Categories.vue';
import Login from '/src/views/Login.vue';
import Profile from '/src/views/Profile.vue';
import ActorDtails from '/src/components/ActorDetails.vue';
import MovieDetails from '/src/components/MovieDetails.vue';


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
    { path: '*', redirect: '/' } ,
    { path: '/actor/:id', component: ActorDtails, name: 'actor-details' },
    { path: '/movie/:id', component: MovieDetails , name: 'movie-details'}
  ]
});

export default router;
