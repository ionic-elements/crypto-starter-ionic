import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CoinList from '@/views/CoinList.vue';
import PostList from '@/views/PostList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/coins'
  },
  {
    path: '/coins',
    name: 'CoinList',
    component: CoinList
  },
  {
    path: '/coins/:id',
    name: 'CoinDetail',
    component: () => import ('@/views/CoinDetail.vue')
  },
  {
    path: '/posts',
    name: 'PostList',
    component: PostList
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
