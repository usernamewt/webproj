import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterOptions,
} from "vue-router";

// 定义路由记录
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: () => import("../components/userProfile/Login.vue"),
  },
  {
    path: "/",
    name: "Home",
    redirect: "/deviceList",
    children: [
      {
        path: "/setting",
        name: "Setting",
        component: () =>
          import("../components/basesetting/stepForm/StepForm.vue"),
      },
      {
        path: "/deviceList",
        name: "DeviceList",
        component: () => import("../components/basedevice/index.vue"),
      },
      {
        path: "/deviceDetail/:id",
        name: "DeviceDetail",
        component: () => import("../components/basedevice/deviceDetail.vue"),
      },
      {
        path:'/sourceAdd/:id',
        name:'addSource',
        component: () => import('../components/basesource/add.vue')
      },
      {
        path: "/sourceList/:id",
        name: "SourceList",
        component: () => import("../components/basesource/index.vue"),
      }
    ],
  },
  {
    path: "/register",
    name: "About",
    component: () => import("../components/userProfile/Register.vue"),
  },

  {
    path: '/:pathMatch(.*)*',
	  component: () => import('../components/404.vue')
  }
  // 添加更多的路由记录...
];

// 创建router实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
