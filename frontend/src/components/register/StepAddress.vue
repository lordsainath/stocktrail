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
      placeholder="Country"
      :error="errors.country"
      required
    />

    <BaseInput
      ref="stateRef"
      v-model="state"
      label="State"
      placeholder="State"
      :error="errors.state"
      required
    />

    <BaseInput
      ref="cityRef"
      v-model="city"
      label="City"
      placeholder="City"
      :error="errors.city"
      required
    />

    <BaseInput
      ref="line1Ref"
      v-model="line1"
      label="Address Line"
      placeholder="Address line"
      :error="errors.line1"
      required
    />

    <BaseInput
      ref="pincodeRef"
      v-model="pincode"
      label="Pincode"
      placeholder="Pincode (optional)"
      maxlength="6"
      :error="errors.pincode"
    />
    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>

      <BaseButton variant="primary" @click="handleContinue"> Continue </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
