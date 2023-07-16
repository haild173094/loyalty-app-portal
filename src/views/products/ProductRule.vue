<template lang="pug">
Page(
  title="Rule",
  :breadcrumbs="[{ content: 'Product Rules', onAction: () => navigate(getRoutePathByName('products')) }]",
)
  Layout
    LayoutSection
      Card(sectioned)
        Text.pb-2(as="p", variant="bodyMd") Rule name:
        TextField(
          v-model="entryData.name",
          disabled,
        )
        p {{ entryData }}
    LayoutSection
      Card(sectioned)
        ChoiceList(
          v-model="typeRule",
          name="singleChoiceList",
          :choices="choices",
          @change="handleChangeTypeRule",
        ) Select the type of rule:
    LayoutSection
      Card(v-if="typeRule === 'product'",sectioned)
        .mb-3
          Text(
            as="h5",
            variant="bodyLg",
          ) Select the products to apply the rule to:
        .mt-3
          ProductPicker(
            v-model="entryData.data.products",
            :allow-multiple="false",
            :extra-output-fields="['id', 'handle', 'image', 'title']",
          )
          p {{ entryData.data.products }}
    LayoutSection
      Card(sectioned)
        .mb-3
          Text(
            as="h5",
            variant="bodyLg",
          ) Select the points to apply the rule to:
          Banner.mt-2(
            status="info",
            :title="typeRule === 'collection' ? 'Collection note' : 'Product note'",
          ) {{ typeRule === 'collection'
            | ? 'This rule will be applied to all products in the selected collection.'
            | : 'This rule will be applied to above selected product.'
            |  }}
        .mt-3
          TextField(
            v-model="entryData.point",
            type="number",
            placeholder="loyalty point",
            prefix="point",
          )
</template>

<script setup lang="ts">
import {
  onMounted, reactive, ref, toRaw, watch,
} from 'vue';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {
  useContextualSaveBar, useNavigation, useRoutingService,
} from '@/services';
import { useAuthenticatedFetch } from '@/services/appBridge';
import { ProductPicker } from '@/components';
import { LayoutSection } from '@ownego/polaris-vue';

const { navigate } = useNavigation();
const { getRoutePathByName } = useRoutingService();
const {
  config: configContextualSaveBar,
  show: showContextualSaveBar,
  hide: hideContextualSaveBar,
  unsubscribe: unsubscribeContextualSaveBar,
  onSave: onSaveContextualSaveBar,
  onDiscard: onDiscardContextualSaveBar,
} = useContextualSaveBar();
const fetchFunction = useAuthenticatedFetch();

const choices = [
  {
    label: 'Specific products',
    value: 'product',
  },
  {
    label: 'Collection',
    value: 'collection',
  },
];

const entryData = ref<any>({
  id: '',
  name: '',
  type: '',
  data: { products: [] },
  point: 0,
});

const typeRule = ref('product');

const handleChangeTypeRule = () => {
  entryData.value.type = typeRule.value;
};

let originalEntryData: typeof entryData.value = {
  id: '',
  name: '',
  type: '',
  data: { products: [] },
  point: 0,
};

watch(
  () => entryData.value,
  newVal => {
    const isDataChanged = !isEqual(toRaw(newVal), toRaw(originalEntryData));

    if (isDataChanged) {
      showContextualSaveBar();
    } else {
      setTimeout(() => {
        hideContextualSaveBar();
      }, 10);
    }
  },
  { deep: true },
);

onMounted(() => {
  entryData.value.name = `${typeRule.value} Rule`;
  entryData.value.type = typeRule.value;
  originalEntryData = cloneDeep(entryData.value);
});

// Save entry data
onSaveContextualSaveBar(triggerSaveAction);
onDiscardContextualSaveBar(triggerDiscardAction);

function removeShopifyGidPrefix (originString: string, type: string): string {
  return `${originString}`.replace(`gid://shopify/${type}/`, '');
}

function triggerSaveAction(): void {
  configContextualSaveBar({ saveAction: { loading: true } });

  const removePrefixId: string = removeShopifyGidPrefix(entryData.value.data.products[0].id, 'Product');

  const requestParams = {
    name: entryData.value.name,
    type: entryData.value.type,
    shopify_id: removePrefixId,
    loyalty_point: +entryData.value.point,
  };

  fetchFunction.post('loyalty-rules', requestParams)
    .then((res: any) => {
      console.log('res', res);
    })
    .catch((err: any) => {
      console.log('err', err);
    })
    .finally(() => {
      configContextualSaveBar({ saveAction: { loading: false } });
    });
}

// Discard entry data
function triggerDiscardAction(): void {
  entryData.value = cloneDeep(originalEntryData);
}
</script>
