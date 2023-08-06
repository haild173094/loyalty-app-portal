<template lang="pug">
.product-picker
  .product-picker__label.form-field-label(v-if="$slots.label")
    slot(name="label")
  .product-picker__wrapper
    Combobox(
      :height="productData?.length > 5 ? '300px' : ''",
      :allow-multiple="allowMultiple",
      @scrolled-to-bottom="handleLoadMore",
    )
      template(#activator)
        ComboboxTextField(
          v-model="searchKeyword",
          auto-complete="off",
          :placeholder="placeholder",
          @change="handleSearchChange",
          @focus="handleSearchFocus",
        )
          template(#prefix)
            Icon(:source="SearchMinor", color="inkLighter")
        .product-picker__helpText.form-field-helpText(v-if="$slots['help-text']")
          slot(name="help-text")
      Listbox(@select="handleProductSelected")
        ListboxLoading(v-if="isCollectingData", accessibility-label="Products are loading")
        Stack(
          v-else-if="!productData.length",
          distribution="center",
        )
          TextStyle No product found
        template(v-else)
          ListboxOption(
            v-for="item in productData",
            :key="item.id",
            :value="item.id",
          )
            .product-picker__option-item
              Stack(alignment="center", :wrap="false")
                Checkbox(:checked="isOptionSelected(item.id)")
                Thumbnail(
                  :alt="item.title",
                  size="small",
                  :source="item?.image?.url ? item.image.url : ''",
                )
                .truncate
                  TextStyle {{ item.title }}
          ListboxLoading(v-if="pageInfo.hasNextPage")
    TextContainer.mt-2(v-if="modelValue?.length")
      .model-out(v-if="!collapsible")
        Stack.mt-2
          TextStyle(
            :variation="$slots.label ? undefined : 'strong'",
          ) {{ modelValue?.length || 0 }} product selected
          Text(
            as="p",
            variant="bodyMd",
          ) ({{ modelValue[0].title }})

      template(v-else)
        Button(
          plain,
          :disclosure="isCollapseSelected ? 'down' : 'up'",
          @click="isCollapseSelected = !isCollapseSelected",
        ) {{ modelValue?.length || 0 }} product selected 222
        Collapsible(
          :id="`product-picker-collapsible-${generateId()}`",
          :key="modelValue?.length",
          :open="!isCollapseSelected || !collapsible",
        )
          ResourceList(:show-header="false")
            ResourceItem(
              v-for="item in modelValue",
              :id="item.id",
              :key="item.id",
              vertical-alignment="center",
            )
              template(#media)
                Thumbnail(
                  v-if="item.image",
                  :alt="item.title",
                  size="small",
                )
              Stack(alignment="center", no-item-wrap)
                StackItem(fill)
                  h3
                    TextStyle {{ item.title }}
                StackItem
                  Button(
                    plain,
                    :icon="CancelSmallMinor",
                    @click="handleRemoveItem(item.id)",
                  )
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue';
import { REQUEST_CONFIG } from '@/configs';
import {
  generateId,
  shopifyImageFilter,
  useAuthenticatedFetch,
} from '@/services';
import SearchMinor from '@icons/SearchMinor.svg';
import CancelSmallMinor from '@icons/CancelSmallMinor.svg';

interface Props {
  allowMultiple?: boolean;
  modelValue?: Record<string, any>[];
  placeholder?: string;
  collapsible?: boolean;
  extraOutputFields?: string[];
}
const props = defineProps<Props>();

const fetchFunction = useAuthenticatedFetch();

const emits = defineEmits<{
  (e: 'change', value: Record<string, any>[]): void;
  (e: 'update:modelValue', value: Record<string, any>[]): void;
}>();

const searchKeyword = ref('');
const isCollectingData = ref<boolean>(false);
const productData = ref<Record<string, any>[]>([]);
const floodInput = ref<any>(null);
const isCollapseSelected = ref<boolean>(false);
const pageInfo = reactive<{
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>({
  hasNextPage: false,
  hasPreviousPage: false,
});

const endCursor = computed(() => productData.value[productData.value.length - 1]?.cursor);

const isOptionSelected = (id: string) => props.modelValue?.some(item => item.id === id);

const handleSearchFocus = () => {
  if (productData.value.length) {
    return;
  }

  collectProducts(searchKeyword.value);
};

onMounted(() => {
  if (props.collapsible) {
    isCollapseSelected.value = true;
  }
});

const collectProducts = (keyword?: string, nextCursor?: string) => {
  if (!nextCursor) {
    isCollectingData.value = true;
  }

  fetchFunction.get('/shopify/products')
    .then((res: any) => {
      if (nextCursor) {
        productData.value = [...(productData.value || []), ...res.data];
      } else {
        productData.value = res.data;
      }

      pageInfo.hasNextPage = res.meta.hasNextPage;
      pageInfo.hasPreviousPage = res.meta.hasPreviousPage;
    })
    .catch((err: any) => {
      console.log(err);
    })
    .finally(() => {
      isCollectingData.value = false;
    });
};

const handleProductSelected = (value: string) => {
  const existedItemIndex = props.modelValue?.findIndex(({ id }) => id === value);

  // if item is existed, remove it
  if (existedItemIndex !== -1 && existedItemIndex !== undefined) {
    removeItem(value);

    return;
  }

  // If not allow multiple, remove all items
  if (!props.allowMultiple) {
    props.modelValue?.map(({ id }) => removeItem(id));
  }

  setTimeout(() => {
    addItem(value);
  }, 10);
};

const handleRemoveItem = (id: string) => {
  removeItem(id);
};

const handleLoadMore = () => {
  if (pageInfo.hasNextPage && !isCollectingData.value) {
    collectProducts(searchKeyword.value, endCursor.value);
  }
};

const handleSearchChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  clearTimeout(floodInput.value || undefined);

  floodInput.value = setTimeout(() => {
    collectProducts(target.value);
  }, 500);
};

function removeItem(id: string) {
  const newModelValue = props.modelValue?.filter(({ id: item }) => id !== item) || [];

  emits('update:modelValue', newModelValue);
  emits('change', newModelValue);
}

function addItem(id: string) {
  const productInfo = productData.value.find(item => item.id === id);

  const restOutput = props.extraOutputFields?.reduce((acc: Record<string, any>, field) => {
    acc[field] = productInfo?.[field];

    return acc;
  }, {});

  const modelData = {
    id: id,
    title: productInfo?.title,
    image: { url: productInfo?.image?.url },
    ...restOutput,
  };

  const newModelValue = props.modelValue?.concat(modelData) || [modelData];

  emits('update:modelValue', newModelValue);
  emits('change', newModelValue);
}
</script>
