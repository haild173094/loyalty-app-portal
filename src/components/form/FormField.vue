<template lang="pug">
component(
  :is="field.type",
  v-bind="fieldProps",
  ref="fieldRef",
  :class="['form-field', `form-field__${field.name}`, field.class]",
  :data-field-name="field.name",
  auto-complete="off",
)
  template(v-if="field.label", #label)
    Stack(spacing="tight", no-item-wrap)
      StackItem
        div(v-html="field.label")
      StackItem(v-if="field.tooltip")
        Tooltip(
          dismiss-on-mouse-out,
          preferred-position="mostSpace",
          :content="field.tooltip",
        )
          Icon.form-field__tooltip-icon(:source="QuestionMarkMinor", color="subdued")
      StackItem(v-if="field.plan")
        Badge.text-capitalize(
          size="small",
          :status="field.plan === 'premium' ? 'attention' : 'info'",
        ) {{ field.plan }}
  template(v-if="field.helpText", #help-text)
    span(v-html="field.helpText")

  // Other slots
  template(
    v-for="slot, index in field.slots",
    :key="index",
    #[slot.name],
  )
    span(v-html="slot.content")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QuestionMarkMinor from '@icons/QuestionMarkMinor.svg';

interface Props {
  field: Record<string, any>;
}

const fieldRef = ref<HTMLElement | null>(null);

const props = defineProps<Props>();

const fieldProps = computed(() => props.field.props);

defineExpose({
  name: props.field.name,
  type: props.field.type,
  fieldRef,
});
</script>
