<template lang="pug">
AppProvider
  Frame
    // App content
    .app-content(v-if="isReady")
      router-view

    // Initial section
    .d-flex.align-items-center.justify-content-center.vh-100(v-else)
      // Error section
      .error-section(v-if="isError")
        span.error-section__error-text Error

      // Processing section
      //- .processing-section.text-center(v-else)
      //-   .processing-section__spinner
      //-     Spinner
      //-   .processing-section__processing-message
      //-     span Loading...
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  useAppBridge,
  useGetToken,
  useClientSideRouting,
} from '@/services';
import { useAuthStore } from '@/stores';
import { AUTH_CONFIG } from '@/configs';

const authStore = useAuthStore();

const { login } = authStore;

const isReady = computed(() => authStore.status === AUTH_CONFIG.success);
const isError = computed(() => authStore.status === AUTH_CONFIG.error);

const { shop } = (window as any).qikifyEmbeddedData;

const getToken = useGetToken();
const appBridge = useAppBridge();

function initialize(): void {
  handleLogin();
}

async function handleLogin() {
  try {
    const token = await getToken(appBridge);

    const tokenData = {
      shop: shop.myshopify_domain,
      token,
    };

    login(tokenData);
  } catch (error) {
    authStore.status = AUTH_CONFIG.error;
    console.error(error);
  }
}

// Install routing service
useClientSideRouting();
initialize();
</script>

<style lang="scss">
@import '@/scss/app.scss';
</style>

