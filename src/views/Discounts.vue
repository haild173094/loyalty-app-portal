<template lang="pug">
Page
  Layout
    LayoutSection
      Stack(distribution="trailing")
        Button(
          primary,
          @click="handleCreateRule()",
        ) New Discount
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
                :status="item.type === 'percentage' ? 'info' : 'success'",
              ) {{ item.type === 'percentage' ? 'Percentage' : 'FixedAmount' }}
            IndexTableCell
              Text(as="p", variant="bodyMd") {{ item.amount + (item.type === 'percentage' ? '%' : '') }}
            IndexTableCell
              Badge(
                status="success",
              ) {{ item.loyalty_price|| 0 }}
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
                          @click="handleEditOffer(item)",
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
    :open="isOpenModalCreate",
    @close="isOpenModalCreate = false",
  )
    template(#title) {{ isEdit ? 'Edit Discout' : 'Create new discount blueprint' }}
    template(#content)
      .p-3
        Form
          FormLayout
            FormField(
              v-for="field, fieldIndex in discountSettings",
              :key="fieldIndex",
              :field="field",
              :model-value="entryDiscountData.data[field.name]",
              @change="(payload: any) => { handleFieldDataChange(payload, field) }",
            )
    template(#footer)
      Button(
        v-if="!isEdit",
        primary,
        :loading="isLoading",
        @click="handleSave",
      ) Save
      Button(
        v-else,
        primary,
        :loading="isLoading",
        @click="handleUpdate",
      ) Update
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
              @click="handleDeleteDiscount()",
            ) Delete
</template>

<script setup lang="ts">
import {
  onMounted, ref, reactive,
} from 'vue';
import { useNavigation, useRoutingService, useToast } from '@/services';
import { useProducts } from '@/services/http/product';
import { useAuthenticatedFetch } from '@/services/appBridge';
import { discountSettings } from '@/schema';
import { FormField } from '@/components';
import EditMinor from '@icons/EditMinor.svg';
import DeleteMinor from '@icons/DeleteMinor.svg';

const headings = [
  { title: 'Discount name' },
  { title: 'Type' },
  { title: 'Amount' },
  { title: 'Loyalty price' },
  { title: 'Action' },
];

const resourceName = {
  singular: 'rule-list',
  plural: 'rule-lists',
};

type InputDataType = Event | boolean | string | Record<string, any>;

const { getDiscountBlueprints } = useProducts();
const fetchFunction = useAuthenticatedFetch();
const toast = useToast();

const entryList = ref<Record<string, any>[]>([]);
const isLoadingRules = ref<boolean>(false);
const isOpenModalCreate = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const entryDiscountData = ref<Record<string, any>>({
  data: {},
});
const selectedItem = ref<Record<string, any>>({});

const isEdit = ref<boolean>(false);

const handleEditOffer = (item: any) => {
  selectedItem.value = item;
  isEdit.value = true;
  entryDiscountData.value.data = item;

  entryDiscountData.value.data.time_limit = item?.time_limit / 24 / 60 / 60 || 0;

  isOpenModalCreate.value = true;
};

const triggerModalDelete = (item: any) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const handleCreateRule = () => {
  isEdit.value = false;
  isOpenModalCreate.value = true;
};

const handleFieldDataChange = (payload: InputDataType, field: Record<string, any>) => {
  const isFreeFeature = !field.plan || field.plan === 'free';
  let newVal = payload;

  if (payload instanceof Event) {
    newVal = (payload.target as HTMLInputElement).value;
  }

  entryDiscountData.value.data[field.name] = newVal;
};

const handleSave = () => {
  isLoading.value = true;

  entryDiscountData.value.data.time_limit = entryDiscountData.value.data.time_limit * 24 * 60 * 60 || 0;

  const requestParams = {
    customer_selection: 'all',
    ...entryDiscountData.value.data,
  };

  fetchFunction.post('discount-blueprints', requestParams)
    .then((res: any) => {
      isOpenModalCreate.value = false;

      isLoadingRules.value = true;

      getDiscountBlueprints()
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
    .catch((err: any) => {
      console.log('err : ', err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const handleUpdate = () => {
  isLoading.value = true;

  entryDiscountData.value.data.time_limit = entryDiscountData.value.data.time_limit * 24 * 60 * 60 || 0;

  const requestParams = {
    customer_selection: 'all',
    ...entryDiscountData.value.data,
  };

  fetchFunction.put(`discount-blueprints/${selectedItem.value.id}`, requestParams)
    .then((res: any) => {
      isOpenModalCreate.value = false;

      getDiscountBlueprints()
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
    .catch((err: any) => {
      console.log('err : ', err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const handleDeleteDiscount = () => {
  fetchFunction.delete(`discount-blueprints/${selectedItem.value.id}`)
    .then((res: any) => {
      showDeleteModal.value = false;
      toast.show({ message: 'Discount blueprint deleted successfully' });

      isLoadingRules.value = true;

      getDiscountBlueprints()
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
    .catch((err: any) => {
      console.log('err : ', err);
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

onMounted(
  async () => {
    isLoadingRules.value = true;

    await getDiscountBlueprints()
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
