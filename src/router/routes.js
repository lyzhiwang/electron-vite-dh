import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/home/Index.vue'),
      },
      {
        path: 'project',
        name: 'project',
        component: () => import('../views/home/Project.vue'),
      },
      {
        path: 'preview',
        name: 'preview',
        component: () => import('../views/home/Preview.vue'),
      },
      {
        path: 'creatlive',
        name: 'creatlive',
        component: () => import('../views/home/CreateLive.vue'),
      },
      {
        // 直播设置
        path: 'livesettings',
        name: 'livesettings',
        component: () => import('../views/livesettings/index.vue'),
      },

      {
        // ai创作
        path: 'aicreate',
        name: 'aicreate',
        component: () => import('../views/aicreate/index.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {no_login: true},
  },
  {
    path: '/live',
    name: 'live',
    component: () => import('../views/Live.vue'),
    meta: {no_login: true},
  },
]
export default routes