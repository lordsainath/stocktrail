<script setup>
import { reactive, watch } from 'vue';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';

const props = defineProps({
  show: Boolean,
  form: {
    type: Object,
    default: () => ({
      photoUrl: '',
      loading: false,
    }),
  },
});

const emit = defineEmits(['close', 'save']);

const localForm = reactive({
  photoUrl: '',
  loading: false,
});

watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Profile Image</h3>

    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Update your display photo using an image URL.
    </p>

    <div class="mt-4">
      <BaseInput
        v-model="localForm.photoUrl"
        type="url"
        placeholder="https://example.com/profile.jpg"
      />
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <BaseButton variant="secondary" :full-width="false" @click="emit('close')">
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="localForm.loading"
        variant="primary"
        :full-width="false"
        @click="emit('save', localForm)"
      >
        {{ localForm.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
