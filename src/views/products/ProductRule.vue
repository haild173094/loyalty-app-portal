<template lang="pug">
Page(
  title="Product Rule",
  :breadcrumbs="[{ content: 'Product Rules', onAction: () => navigate(getRoutePathByName('products')) }]",
)
  Layout
    LayoutSection
      Card(sectioned)
        ProductPicker
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNavigation, useRoutingService } from '@/services';
import { ProductPicker } from '@/components';

const { navigate } = useNavigation();
const { getRoutePathByName } = useRoutingService();

</script>
