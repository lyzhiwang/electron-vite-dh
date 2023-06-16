import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
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