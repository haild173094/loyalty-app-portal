import { createRouter, createWebHistory } from 'vue-router';
import {
  AppLayout,
  HomeView,
  Customers,
  Discounts,
  RuleIndex,
  RuleList,
  RuleSettings,
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
        component: RuleIndex,
        children: [
          {
            path: '',
            name: 'rules',
            component: RuleList,
          },
          {
            path: 'settings/:id?',
            name: 'product-rule',
            component: RuleSettings,
          },
        ],
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
