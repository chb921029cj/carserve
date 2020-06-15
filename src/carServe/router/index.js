import Vue from "vue";
import VueRouter from "vue-router";

import Login from "@/carServe/views/common/login";

Vue.use(VueRouter);

const routes = [{
  path: "/",
  name: "Login",
  components: {
    default: Login
  },
  meta: {
    keepAlive: true
  }
}, {
  path: "/Mine",
  name: "Mine",
  component: () => import("@/carServe/views/common/mine"),
  meta: {
    keepAlive: false
  }
}, {
  path: "/Map",
  name: "Map",
  component: () => import("@/carServe/views/common/map"),
  meta: {
    keepAlive: false
  }
}, {
  path: "/Detail",
  name: "Detail",
  component: () => import("@/carServe/views/common/detail"),
  meta: {
    keepAlive: false
  }
}, {
  path: "/CarShop",
  name: "CarShop",
  component: () => import("@/carServe/views/common/carShop"),
  meta: {
    keepAlive: false
  }
}];

const router = new VueRouter({
  routes
});
router.beforeEach((to, form, next) => {
  if (to.path !== '/') {
    if (!localStorage.getItem('new_token')) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router;