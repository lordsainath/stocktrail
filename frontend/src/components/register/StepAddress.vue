<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import useRegisterStore from '../../stores/registerStore';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';
import { registerAddressSchema, validateForm } from '../../utils/validationSchemas';

const router = useRouter();
const registerStore = useRegisterStore();
const formData = registerStore.formData;
const errors = ref({});
const countryRef = ref(null)
const stateRef = ref(null)
const cityRef = ref(null)
const line1Ref = ref(null)
const pincodeRef = ref(null)


const handleBack = () => router.back();
const handleContinue = async () => {
  // Validate form data
  const { isValid, errors: validationErrors } = await validateForm(registerAddressSchema, {
    address: formData.address,
  });

  if (!isValid) {
    errors.value = validationErrors.address || {};
    const firstKey = Object.keys(validationErrors.address || {})[0];
    const refMap = { country: countryRef, state: stateRef, city: cityRef, line1: line1Ref, pincode: pincodeRef };
    await nextTick();
    const target = refMap[firstKey];
    if (target?.value?.focus) target.value.focus();
    return;
  }

  errors.value = {};
  router.push({ name: 'RegisterUsername' });
};
</script>

<template>
  <div class="space-y-4">
    <BaseInput ref="countryRef" v-model="formData.address.country" label="Country" placeholder="Country" :error="errors.country"
      @input="errors.country = null" required />

    <BaseInput ref="stateRef" v-model="formData.address.state" label="State" placeholder="State" :error="errors.state"
      @input="errors.state = null" required />

    <BaseInput ref="cityRef" v-model="formData.address.city" label="City" placeholder="City" :error="errors.city"
      @input="errors.city = null" required />

    <BaseInput ref="line1Ref" v-model="formData.address.line1" label="Address Line" placeholder="Address line" :error="errors.line1"
      @input="errors.line1 = null" required />

    <BaseInput ref="pincodeRef" v-model="formData.address.pincode" label="Pincode" placeholder="Pincode (optional)" maxlength="6"
      :error="errors.pincode" @input="errors.pincode = null" />
    <div class="mt-6 flex gap-4">

      <BaseButton variant="secondary" @click="handleBack">
        Back
      </BaseButton>

      <BaseButton variant="primary" @click="handleContinue">
        Continue
      </BaseButton>

    </div>
  </div>
</template>

<style scoped></style>