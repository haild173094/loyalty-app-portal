<template lang="pug">
FormGroup(
  v-if="fieldSchema.type === 'FieldGroup'",
  v-show="isVisibleField(fieldSchema, schema, fieldsData)",
  :class="fieldSchema.class",
)
  FormField(
    v-for="child in fieldSchema.children",
    v-show="isVisibleField(child, flatSchema, fieldsData)",
    :key="child.name",
    :field="child",
    v-bind="child.props",
    :model-value="fieldsData[child.name]",
    @change="(value: any) => { handleChange(value, child) }",
  )
    p {{ fieldsData[child.name] }}
FormItem(
  v-else-if="fieldSchema.type === 'FieldSlot'",
  v-show="isVisibleField(fieldSchema, schema, fieldsData)",
)
  slot(:name="fieldSchema.slotName")
FormItem(v-else)
  FormField(
    v-show="isVisibleField(fieldSchema, schema, fieldsData)",
    :field="fieldSchema",
    v-bind="fieldProps",
    :model-value="fieldValue",
    @change="(value: any) => { handleChange(value, fieldSchema) }",
  )
  slot
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isVisibleField } from '@/components/form/utils';
import { FormField } from '.';

interface Props {
  schema: Record<string, any>[];
  fieldSchema: Record<string, any>;
  fieldsData: Record<string, any>;
  fieldProps?: Record<string, any>;
  modelValue?: any;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (event: 'update-field', value: string, field: Record<string, any>): void;
  (event: 'change', value: string): void;
  (event: 'update:modelValue', value: string): void;
}>();

const fieldValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emits('change', value);
    emits('update:modelValue', value);
  },
});

const flatSchema = computed(() => props.schema.reduce((acc: Record<string, any>[], field: Record<string, any>) => {
  if (field.type === 'FieldGroup') {
    return [...acc, ...field.children];
  }

  return [...acc, field];
}, []));

const handleChange = (value: any, field: Record<string, any>) => {
  emits('update-field', value, field);
};
</script>
