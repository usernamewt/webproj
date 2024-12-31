import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";
import { getUserInfo } from "../api/user";
import { getStorage, setStorage } from "../utils/storage";
import { useTestStore } from "../store";
// const baseStore = useTestStore();

// 定义路由记录
const routes: Array<RouteRecordRaw> = [
  // 登陆路由
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
        path: "/bindDevice/:id",
        name: "MiddCenter",
        component: () =>
          import("../components/basedevice/deviceBind.vue"),
      },
      {
        path: "/setting/:id",
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
      },{
        // 中转页，判断设备是否绑定，是=》跳转设备列表/设备详情，否=》跳转设备绑定页
        path:"deviceBind/:id",
        name:"deviceBind",
        component: () => import('../components/basedevice/deviceBind.vue')
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

router.beforeEach((to, from, next) => {
  // baseStore.boxLoading = true;
  if (to.path.includes( "/login")) {
    next();
  } else {
    let id = getStorage('uid')
    if (getStorage('uid')&&Object.keys(id).length > 0) {
      next();
    } else {
      getUserInfo().then((res:any) => {
        if (res.code === 0) {
          setStorage('uid', res.data.id);
          next();
        }
      })
    }
  }
})

router.afterEach((to, from) => {
  // baseStore.boxLoading = false;
})

export default router;
