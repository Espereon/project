import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import Edit from "./components/Edit.vue";
import Gazprom from "./components/Gazprom.vue";
import UpdateSoft from "./components/UpdateSoft.vue";

const routes = [
  { path: "/", name: "edit", component: Edit },
  { path: "/gazprom", name: "gazprom", component: Gazprom },
  { path: "/updatesoft", name: "updatesoft", component: UpdateSoft },
  // { path: "/:pathMatch(.*)*", name: "not-found", component: notfound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
