import { Router } from "@vaadin/router";

const outlet = document.getElementById("app");

const router = new Router(outlet);

router.setRoutes([
  {
    path: "/",
    component: "mi-home",
  },
  {
    path: "/destinations",
    component: "mi-destinations",
  },
  {
    path: "/login",
    component: "login-page",
  },
  {
    path: "/register",
    component: "register-page",
  },
  {
    path: "/dashboard",
    component: "dashboard-page",
  },
  { path: "(.*)", redirect: "/" },
]);

export { router };
