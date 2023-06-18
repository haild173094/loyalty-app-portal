import { createRouter, createWebHistory } from 'vue-router';
import {
  AppLayout,
  HomeView,
  Customers,
  Discounts,
  Rules
} from '@/views';

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/customers',
        name: 'customers',
        component: Customers,
      },
      {
        path: '/discounts',
        name: 'discounts',
        component: Discounts,
      },
      {
        path: '/rules',
        name: 'rules',
        component: Rules,
      },
    ],
  },
];

const routerInitialConfig = {
  history: createWebHistory(),
  routes,
};
const router = createRouter(routerInitialConfig);

export default router;
