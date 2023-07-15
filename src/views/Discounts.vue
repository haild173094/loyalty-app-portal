<template lang="pug">
h1 Discounts page
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthenticatedFetch } from '@/services';

const fetchFunction = useAuthenticatedFetch();

fetchFunction.get('discount-blueprints')
  .then(res => {
    console.log(res);
  });
</script>
