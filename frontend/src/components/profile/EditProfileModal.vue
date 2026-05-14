<script setup>
import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';
import { useProfileStore } from '@/stores/profileStore';
import { storeToRefs } from 'pinia';

const profileStore = useProfileStore();
const { photoUrl, defineProfileError } = storeToRefs(profileStore);

defineProps({
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

// const { updateProfile } = useProfileStore();

// const localForm = reactive({
//   photoUrl: '',
//   loading: false,
// });

// watch(
//   () => props.form,
//   (newForm) => {
//     Object.assign(localForm, newForm);
//   },
//   { immediate: true, deep: true }
// );
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Edit Profile Image</h3>

    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Update your display photo using an image URL.
    </p>

    <div class="mt-4">
      <BaseInput
        v-model="photoUrl"
        type="url"
        placeholder="https://example.com/profile.jpg"
        :error="defineProfileError.photoUrl"
      />
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <BaseButton
        variant="secondary"
        :full-width="false"
        :disabled="profileStore.profileForm.loading"
        @click="profileStore.closeProfileModal"
      >
        Cancel
      </BaseButton>

      <BaseButton
        variant="primary"
        :full-width="false"
        :disabled="profileStore.profileForm.loading"
        @click="profileStore.updateProfile"
      >
        {{ profileStore.profileForm.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
