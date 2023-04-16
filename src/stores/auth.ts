import { defineStore } from 'pinia';
import { AUTH_STATUS } from '@/configs';

interface IAuthState {
  status: string;
  token: string;
}

const defaultState: IAuthState = {
  status: AUTH_STATUS.initial,
  token: '',
};

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => defaultState,

  getters: {},

  actions: {},
});
