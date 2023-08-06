<template lang="pug">
.collection-picker
  .collection-picker__label.form-field-label(v-if="$slots.label")
    slot(name="label")
  .collection-picker__wrapper
    Combobox(
      :height="collectionData.length > 5 ? '300px' : ''",
      :allow-multiple="allowMultiple",
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
        .collection-picker__helpText.form-field-helpText(v-if="$slots['help-text']")
          slot(name="help-text")
      Listbox(@select="handleSelected")
        ListboxLoading(v-if="isCollectingData", accessibility-label="Collections are loading")
        Stack(
          v-else-if="!collectionData.length",
          distribution="center",
        )
          TextStyle No collections found
        template(v-else)
          ListboxOption(
            v-for="item in collectionData",
            :key="item.id",
            :value="item.id",
          )
            .product-picker__option-item
              Stack(alignment="center", :wrap="false")
                Checkbox(:checked="isOptionSelected(item.id)")
                Thumbnail(
                  :alt="item.title",
                  :source="item?.image?.url && shopifyImageFilter(item.image.url, 'icon')",
                  size="small",
                )
                .truncate
                  TextStyle {{ item.title }}
    TextContainer.mt-2(v-if="modelValue?.length")
      TextStyle(
        v-if="!collapsible",
        :variation="$slots.label ? undefined : 'strong'",
      ) {{ modelValue?.length || 0 }} collection selected
      Button(
        v-else,
        plain,
        :disclosure="isCollapseSelected ? 'down' : 'up'",
        @click="isCollapseSelected = !isCollapseSelected",
      ) {{ modelValue?.length || 0 }} collection selected
      Collapsible(
        id="product-picker-collapsible",
        :key="modelValue?.length",
        :open="!isCollapseSelected || !collapsible",
      )
        ResourceList(:show-header="false")
          ResourceItem(
            v-for="item in modelValue",
            :id="item.id",
            :key="item.id",
            :persist-actions="true",
            vertical-alignment="center",
          )
            template(#media)
              Thumbnail(
                v-if="item.image",
                :alt="item.title",
                :source="shopifyImageFilter(item.image.url, 'icon')",
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
import { onMounted, ref } from 'vue';
import { shopifyImageFilter } from '@/services';
import SearchMinor from '@icons/SearchMinor.svg';
import CancelSmallMinor from '@icons/CancelSmallMinor.svg';
import { useAuthenticatedFetch } from '@/services/appBridge';

interface Props {
  allowMultiple?: boolean;
  modelValue?: Record<string, any>[];
  placeholder?: string;
  collapsible?: boolean;
}
const props = defineProps<Props>();

const fetchFunction = useAuthenticatedFetch();

const emits = defineEmits<{
  (e: 'change', value: Record<string, any>[]): void;
  (e: 'update:modelValue', value: Record<string, any>[]): void;
}>();

const searchKeyword = ref('');
const isCollectingData = ref<boolean>(false);
const collectionData = ref<Record<string, any>[]>([]);
const isCollapseSelected = ref<boolean>(false);
const floodFilter = ref<null | number>(null);

const isOptionSelected = (id: string) => props.modelValue?.some(item => item.id === id);

const handleSearchFocus = () => {
  collectData({ title: searchKeyword.value });
};

onMounted(() => {
  if (props.collapsible) {
    isCollapseSelected.value = true;
  }
});

const collectData = (requestParams?: Record<string, any>) => {
  isCollectingData.value = true;

  fetchFunction.get('/shopify/collections')
    .then((res: any) => {
      collectionData.value = res.data;
    })
    .catch((err: any) => {
      console.log('error');
    })
    .finally(() => {
      isCollectingData.value = false;
    });
};

const handleSelected = (value: string) => {
  const existedItemIndex = props.modelValue?.findIndex(({ id }) => id === value);

  // if item is existed, remove it
  if (existedItemIndex !== -1 && existedItemIndex !== undefined) {
    removeItem(value);

    return;
  }

  addItem(value);
};

const handleRemoveItem = (id: string) => {
  removeItem(id);
};

const handleSearchChange = (event: Event) => {
  if (floodFilter.value) {
    clearTimeout(floodFilter.value);
  }

  floodFilter.value = setTimeout(() => {
    collectData({ title: searchKeyword.value });
  }, 500);
};

function removeItem(id: string) {
  const newModelValue = props.modelValue?.filter(({ id: item }) => id !== item) || [];

  emits('update:modelValue', newModelValue);
  emits('change', newModelValue);
}

function addItem(id: string) {
  const itemInfo = collectionData.value.find(item => item.id === id);

  const modelData = {
    id: id,
    title: itemInfo?.title,
    image: itemInfo?.image?.url && { url: itemInfo?.image?.url },
    handle: itemInfo?.handle,
  };

  const newModelValue = props.allowMultiple
    ? props.modelValue?.concat(modelData) || []
    : [modelData];

  emits('update:modelValue', newModelValue);
  emits('change', newModelValue);
}
</script>
