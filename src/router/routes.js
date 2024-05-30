const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PageHome.vue"), name: "Home" },
      {
        path: "/about",
        component: () => import("pages/PageAbout.vue"),
        name: "About",
      },
      {
        path: "/login",
        component: () => import("pages/PageLogin.vue"),
        name: "Login",
      },
      {
        path: "/signup",
        component: () => import("pages/PageSignup.vue"),
        name: "Signup",
      },
      {
        path: "/admin",
        component: () => import("pages/PageAdmin.vue"),
        name: "Admin",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
