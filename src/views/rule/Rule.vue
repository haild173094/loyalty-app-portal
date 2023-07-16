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
        Spinner(v-if="isLoadingRules")
        IndexTable(
          v-else,
          :resource-name="resourceName",
          :headings="headings",
          :loading="isLoadingRules",
          :item-count="entryList.length",
        )
          IndexTableRow(
            v-for="(item, index) in entryList",
            :id="item.id",
            :key="item.id",
            :position="index",
          )
            IndexTableCell
              Stack(alignment="center")
                div
                  TextStyle.co-entry-list__item__name.truncate(variation="strong") {{ item.name }}
            IndexTableCell
              Badge(
                status="success",
              ) {{ item.shopify_id }}
            IndexTableCell
              Text(as="p", variant="bodyMd") {{ item.type === 'product' ? 'Product' : 'Collection' }}
            IndexTableCell
              Badge(
                status="success",
              ) {{ item.loyalty_point || 0 }}
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
import { onMounted, ref } from 'vue';
import { useNavigation, useRoutingService } from '@/services';
import { useProducts } from '@/services/http/product';
import { Card, Layout } from '@ownego/polaris-vue';
import EditMinor from '@icons/EditMinor.svg';
import DeleteMinor from '@icons/DeleteMinor.svg';

const headings = [
  { title: 'Rule name' },
  { title: 'Product/Collection Id' },
  { title: 'Rule type' },
  { title: 'Loyalty point' },
  { title: 'Action' },
];

const resourceName = {
  singular: 'rule-list',
  plural: 'rule-lists',
};

const { getLoyaltyRules } = useProducts();
const { navigate } = useNavigation();
const { getRoutePathByRouteObject } = useRoutingService();

const entryList = ref<Record<string, any>[]>([]);
const isLoadingRules = ref<boolean>(false);

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

onMounted(
  async () => {
    isLoadingRules.value = true;

    await getLoyaltyRules()
      .then((res: any) => {
        console.log('loyalty rules: ', res);
        entryList.value = res?.data || [];
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        isLoadingRules.value = false;
      });
  },
);
</script>
