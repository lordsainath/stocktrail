<script setup>
import { ref, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import useRegisterStore from '@stores/registerStore';
import BaseInput from '@components/base/BaseInput.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { registerAddressSchema } from '@composables/useValidationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const countryRef = ref(null);
const stateRef = ref(null);
const cityRef = ref(null);
const line1Ref = ref(null);
const pincodeRef = ref(null);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: registerAddressSchema,
  initialValues: {
    country: formData.address.country || '',
    state: formData.address.state || '',
    city: formData.address.city || '',
    line1: formData.address.line1 || '',
    pincode: formData.address.pincode || '',
  },
});

const [country] = defineField('country');
const [state] = defineField('state');
const [city] = defineField('city');
const [line1] = defineField('line1');
const [pincode] = defineField('pincode');

watch(country, (value) => {
  formData.address.country = value || '';
});

watch(state, (value) => {
  formData.address.state = value || '';
});

watch(city, (value) => {
  formData.address.city = value || '';
});

watch(line1, (value) => {
  formData.address.line1 = value || '';
});

watch(pincode, (value) => {
  formData.address.pincode = value || '';
});

const handleBack = () => router.back();
const handleContinue = handleSubmit(
  async () => {
    router.push({ name: 'RegisterUsername' });
  },
  async () => {
    const firstKey = Object.keys(errors.value || {})[0];
    const refMap = {
      country: countryRef,
      state: stateRef,
      city: cityRef,
      line1: line1Ref,
      pincode: pincodeRef,
    };
    await nextTick();
    const target = refMap[firstKey];
    if (target?.value?.focus) target.value.focus();
  }
);
</script>
<template>
  <div class="space-y-4">
    <BaseInput
      ref="countryRef"
      v-model="country"
      label="Country"
      placeholder="Enter country"
      :error="errors.country"
      required
      @keyup.enter="stateRef?.focus()"
    />

    <BaseInput
      ref="stateRef"
      v-model="state"
      label="State"
      placeholder="Enter state"
      :error="errors.state"
      required
      @keyup.enter="cityRef?.focus()"
    />

    <BaseInput
      ref="cityRef"
      v-model="city"
      label="City"
      placeholder="Enter city"
      :error="errors.city"
      required
      @keyup.enter="line1Ref?.focus()"
    />

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Address Line <span class="text-red-500">*</span>
      </label>

      <textarea
        ref="line1Ref"
        v-model="line1"
        rows="4"
        placeholder="Enter address line"
        :class="[
          'w-full mt-2 border-2 rounded-xl px-4 py-3 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none',

          errors.line1
            ? 'border-red-500 focus:ring-1 focus:ring-red-400'
            : 'border-slate-200 dark:border-slate-600 focus:ring-1 focus:ring-primary focus:border-transparent',
        ]"
        @keyup.enter.prevent="pincodeRef?.focus()"
      />
      <p v-if="errors.line1" class="mt-1 text-sm text-red-500">
        {{ errors.line1 }}
      </p>
    </div>

    <BaseInput
      ref="pincodeRef"
      v-model="pincode"
      label="Pincode"
      type="text"
      inputmode="numeric"
      placeholder="Enter pincode (optional)"
      maxlength="6"
      :error="errors.pincode"
      @input="pincode = pincode.replace(/\D/g, '')"
      @keyup.enter="handleContinue"
    />

    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>

      <BaseButton variant="primary" @click="handleContinue"> Continue </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
