import { createRouter, createWebHistory } from 'vue-router';
import { AppLayout } from '@/components';
import {
  AnalyticsView,
  HomeView,
  ProfileView,
  SettingView,
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
        path: '/analytics',
        name: 'analytics',
        component: AnalyticsView,
      },
      {
        path: '/setting',
        name: 'setting',
        component: SettingView,
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
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
