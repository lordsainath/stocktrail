<script setup>
import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';

defineProps({
  show: Boolean,
  form: Object,
});

const emit = defineEmits(['close', 'save']);
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>

    <div class="mt-4">
      <BaseInput v-model="form.password" type="password" placeholder="New password" />
    </div>

    <div class="mt-3">
      <BaseInput v-model="form.confirmPassword" type="password" placeholder="Confirm password" />
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <BaseButton variant="secondary" :full-width="false" @click="emit('close')">
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="form.loading"
        variant="primary"
        :full-width="false"
        @click="emit('save')"
      >
        {{ form.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
