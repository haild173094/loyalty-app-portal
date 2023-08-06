<template lang="pug">
Page(
  title="Rule",
  :breadcrumbs="[{ content: 'Product Rules', onAction: () => navigate(getRoutePathByName('rules')) }]",
)
  Layout
    LayoutSection
      Card(sectioned)
        Text.pb-2(as="p", variant="bodyMd") Rule name:
        TextField(
          v-model="entryData.name",
          disabled,
        )
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
      Card(v-else, sectioned)
        .mb-3
          Text(
            as="h5",
            variant="bodyLg",
          ) Select the collection to apply the rule to:
        .mt-3
          CollectionsPicker(
            v-model="entryData.data.products",
            :allow-multiple="false",
            :extra-output-fields="['id', 'handle', 'image', 'title']",
          )
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
  onMounted, reactive, ref, toRaw, watch, computed,
} from 'vue';
import { useRoute } from 'vue-router';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {
  useContextualSaveBar, useNavigation, useRoutingService,
} from '@/services';
import { useAuthenticatedFetch } from '@/services/appBridge';
import { ProductPicker, CollectionsPicker } from '@/components';
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
const route = useRoute();

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

const isEdit = computed(() => entryData.value.id !== '');

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

const populateEntryData = async (populateData: typeof entryData.data) => {
  originalEntryData.id = populateData.id;
  originalEntryData.name = populateData.name;
  originalEntryData.type = populateData.type;
  originalEntryData.point = populateData.loyalty_point;

  if (populateData.type === 'collection') {
    originalEntryData.data.products = await collectCollections(populateData.shopify_id);
  } else {
    originalEntryData.data.products = await collectProducts(populateData.shopify_id);
  }

  entryData.value = cloneDeep(originalEntryData);
};

const collectRuleData = () => {
  fetchFunction.get('loyalty-rules')
    .then((res: any) => {
      const dataResponse = res.data.find((item: any) => item.id === +entryData.value.id);

      typeRule.value = dataResponse.type;

      populateEntryData(dataResponse);
    })
    .catch((err: any) => {
      console.log('err', err);
    });
};

const collectProducts = async (id: any) => {
  const test: any = [];

  await fetchFunction.get('/shopify/products')
    .then((res: any) => {
      res.data.forEach((item: any) => {
        if (item.shopify_id === id) {
          test.push(item);
        }
      });
    })
    .catch((err: any) => {
      console.log(err);
    });

  return test;
};

const collectCollections = async (id: any) => {
  const test: any = [];

  await fetchFunction.get('/shopify/collections')
    .then((res: any) => {
      res.data.forEach((item: any) => {
        if (item.shopify_id === id) {
          test.push(item);
        }
      });
    })
    .catch((err: any) => {
      console.log(err);
    });

  return test;
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

watch(
  () => typeRule.value,
  newVal => {
    entryData.value.name = `${newVal} Rule #${entryData.value.id || 0}`;
  },
);

onMounted(() => {
  entryData.value.name = `${typeRule.value} Rule #${entryData.value.id || 0}`;
  entryData.value.type = typeRule.value;
  originalEntryData = cloneDeep(entryData.value);

  if (route.params.id) {
    entryData.value.id = route.params?.id;
    collectRuleData();
  }
});

// Save entry data
onSaveContextualSaveBar(triggerSaveAction);
onDiscardContextualSaveBar(triggerDiscardAction);

function removeShopifyGidPrefix (originString: string, type: string): string {
  return `${originString}`.replace(`gid://shopify/${type}/`, '');
}

function triggerSaveAction(): void {
  configContextualSaveBar({ saveAction: { loading: true } });

  // eslint-disable-next-line max-len
  const removePrefixId: string = removeShopifyGidPrefix(entryData.value.data.products[0].id, entryData.value.type === 'product' ? 'Product': 'Collection');

  const requestParams = {
    name: entryData.value.name,
    type: entryData.value.type,
    shopify_id: removePrefixId,
    loyalty_point: +entryData.value.point,
  };

  // fetchFunction.post('loyalty-rules', requestParams)

  const requestCaller = isEdit.value
    ? fetchFunction.put(`/loyalty-rules/${entryData.value.id}`, requestParams)
    : fetchFunction.post('loyalty-rules', requestParams);

  requestCaller
    .then((res: any) => {
      console.log('res', res);
      console.log('originalEntryData', originalEntryData);
      entryData.value = cloneDeep(originalEntryData);
      navigate(getRoutePathByName('rules'));
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
