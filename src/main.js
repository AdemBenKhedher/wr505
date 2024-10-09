import RouterPlugin from "vue-router";
import router from "/router/index.js";
import Vue from "vue";
import App from "./App.vue";

Vue.use(RouterPlugin)

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
