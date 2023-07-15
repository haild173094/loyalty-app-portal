<template lang="pug">
p products
Page
  Layout
    LayoutSection
      Stack(distribution="trailing")
        Button(
          primary,
          @click="handleCreateRule()",
        ) Generate New Rule
    LayoutSection
      Card(sectioned)
        IndexTable(
          :resource-name="resourceName",
          :heading="headings",
        )
          IndexTableRow(
            v-for="(item, index) in entryList",
            :id="item.id",
            :key="item.id",
            :position="index",
            :status="!item.status ? 'subdued' : ''",
          )
            IndexTableCell
              Stack(alignment="center")
                div
                  TextStyle.co-entry-list__item__name.truncate(variation="strong") {{ item.name }}
                Badge(v-if="item.data.enable_ab_testing") active
            IndexTableCell
              Badge(
                v-if="item.status === 1",
                status="success",
              ) active
              Badge(
                v-else,
                status="warning",
              ) inactive
            IndexTableCell
              .co-entry-list__item__actions
                Stack(distribution="trailing")
                  ButtonGroup
                    Stack(spacing="loose")
                      Tooltip(
                        dismiss-on-mouse-out,
                        content="edit",
                      )
                        Button(
                          plain,
                          :icon="EditMinor",
                          @click="handleEditOffer(item.id)",
                        )
                      Tooltip(
                        dismiss-on-mouse-out,
                        content="delete",
                      )
                        Button(
                          plain,
                          :icon="DeleteMinor",
                          @click="triggerModalDelete(item)",
                        )

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNavigation, useRoutingService } from '@/services';
import { useProducts } from '@/services/http/product';
import { Card, Layout } from '@ownego/polaris-vue';
import EditMinor from '@icons/EditMinor.svg';
import DeleteMinor from '@icons/DeleteMinor.svg';

const { getProducts, getShopifyProducts } = useProducts();
const { navigate } = useNavigation();
const { getRoutePathByRouteObject } = useRoutingService();

getProducts();
getShopifyProducts();

const headings = [
  { title: 'Name' },
  { title: 'Location' },
  { title: 'Order count' },
  { title: 'Amount spent' },
];

const resourceName = {
  singular: 'product-list',
  plural: 'product-lists',
};

const handleEditOffer = (id: any) => {
  navigate(getRoutePathByRouteObject({
    name: 'product-rule',
    params: { id },
  }));
};

const triggerModalDelete = (item: any) => {
  console.log('triggerModalDelete');
};

const handleCreateRule = (id?: any) => {
  console.log('handleCreateRule');
  navigate(getRoutePathByRouteObject({
    name: 'product-rule',
    params: { id },
  }));
};
</script>
