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
Modal(
  :open="showDeleteModal",
  @close="showDeleteModal = false",
)
  template(#title) Are you sure?
  template(#content)
    ModalSection
      Text(
        as="p",
        variant="bodyMd",
      ) Are you sure you want to delete this rule?
      .my-4
        ButtonGroup
          Button Cancel
          Button(
            primary,
            @click="handleDeleteRule()",
          ) Delete
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  useNavigation, useRoutingService, useAuthenticatedFetch, useToast,
} from '@/services';
import { useProducts } from '@/services/http/product';
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
const fetchFunction = useAuthenticatedFetch();
const toast = useToast();

const entryList = ref<Record<string, any>[]>([]);
const isLoadingRules = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const selectedDeleteItem = ref<Record<string, any>>({});

const handleEditOffer = (id: any) => {
  navigate(getRoutePathByRouteObject({
    name: 'product-rule',
    params: { id },
  }));
};

const triggerModalDelete = (item: any) => {
  selectedDeleteItem.value = item;
  showDeleteModal.value = true;
};

const handleCreateRule = (id?: any) => {
  navigate(getRoutePathByRouteObject({
    name: 'product-rule',
    params: { id },
  }));
};

const handleDeleteRule = () => {
  fetchFunction.delete(`/loyalty-rules/${selectedDeleteItem.value.id}`)
    .then((res: any) => {
      showDeleteModal.value = false;
      toast.show({ message: 'Delete rule successfully' });
      isLoadingRules.value = true;

      getLoyaltyRules()
        .then((res: any) => {
          entryList.value = res?.data || [];
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          isLoadingRules.value = false;
        });
    })
    .catch(err => {
      console.log(err);
    });
};

onMounted(
  async () => {
    isLoadingRules.value = true;

    await getLoyaltyRules()
      .then((res: any) => {
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
