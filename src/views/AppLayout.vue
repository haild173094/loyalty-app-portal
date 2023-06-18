<template lang="pug">
router-view
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NAVIGATION_ITEMS } from '@/configs';
import { useNavigation } from '@/services/appBridge';

const { setNavigation } = useNavigation();

setNavigation(NAVIGATION_ITEMS);
</script>
