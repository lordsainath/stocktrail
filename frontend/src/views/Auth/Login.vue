<!-- Script Started -->

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

import useAuthStore from '@stores/authStore';
import useUserStore from '@stores/userStore';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';
import BaseOtpInput from '@/components/base/BaseOtpInput.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import { getErrorMessage } from '@composables/useErrorMessage';
import { loginCredentialsSchema, loginPinSchema } from '@composables/useValidationSchemas';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const step = computed(() => authStore.step);
const loading = computed(() => authStore.loading);

const validationSchema = computed(() =>
  step.value === 'credentials' ? loginCredentialsSchema : loginPinSchema,
);

const { errors, defineField, validate, setFieldValue, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
    pin: '',
  },
  validateOnChange: false,
  validateOnBlur: false,
});

// Clear errors when step changes
watch(() => step.value, () => {
  Object.keys(errors.value).forEach(field => {
    setFieldError(field, '');
  });
});

const [email] = defineField('email');
const [password] = defineField('password');
const [pin] = defineField('pin');

const emailRef = ref(null);
const passwordRef = ref(null);
const pinRef = ref(null);

const focusFirstError = async (errorKey) => {
  const refMap = {
    email: emailRef,
    password: passwordRef,
    pin: pinRef,
  };

  await nextTick();
  const target = refMap[errorKey];
  if (target?.value?.focus) target.value.focus();
};

async function onCredentialsSubmit() {
  const { valid, errors: validationErrors } = await validate();

  if (!valid) {
    const firstKey = Object.keys(validationErrors || {})[0];
    await focusFirstError(firstKey);
    return;
  }

  const res = await authStore.startLogin({
    email: email.value,
    password: password.value,
  });

  if (!res?.success) {
    toast.error(getErrorMessage(res?.error, 'Login failed'));
    return;
  }

  toast.success('Password verified. Enter your PIN to continue.');
}

async function onPinSubmit() {
  const { valid, errors: validationErrors } = await validate();

  if (!valid) {
    const firstKey = Object.keys(validationErrors || {})[0];
    await focusFirstError(firstKey);
    return;
  }

  const res = await authStore.verifyPin(pin.value);

  if (!res?.success) {
    setFieldValue('pin', '');
    setFieldError('pin', getErrorMessage(res?.error, 'PIN verification failed'));
    toast.error(getErrorMessage(res?.error, 'PIN verification failed'));
    return;
  }

  userStore.setSession(res.session);
  toast.success('Login successful');
  router.push('/');
}

const backToCredentials = () => {
  authStore.backToCredentials();
  setFieldValue('pin', '');
};
</script>

<!-- Script Ended -->
<!-- Template Started -->

<template>
  <div
    class="min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
    <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left info card -->
      <div
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col justify-between border border-slate-200 dark:border-slate-700">
        <div>
          <div class="text-sm text-primary font-semibold tracking-widest uppercase">
            StockTrail Access
          </div>
          <h2 class="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Market-ready workspace for focused investors.
          </h2>
          <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Continue with secure sign in, then verify PIN to unlock your dashboard and
            portfolio controls.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4">
          <div class="rounded-xl p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Security</div>
            <div class="font-semibold text-slate-900 dark:text-white">2-step Login</div>
          </div>
          <div class="rounded-xl p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Access</div>
            <div class="font-semibold text-slate-900 dark:text-white">PIN Protected</div>
          </div>
        </div>
      </div>

      <!-- Right form card -->
      <div
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <i class="fa-solid fa-lock text-white"></i>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {{ step === 'credentials' ? 'Welcome Back' : 'Verify PIN' }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {{
              step === 'credentials'
                ? 'Sign in to continue with StockTrail.'
                : 'Enter the 4-digit PIN linked to your account.'
            }}
          </p>
        </div>

        <form v-if="step === 'credentials'" class="space-y-5" @submit.prevent="onCredentialsSubmit">
          <BaseInput ref="emailRef" v-model="email" label="Email Address" type="email" placeholder="Enter email address"
            :error="errors.email" required />

          <BaseInput ref="passwordRef" v-model="password" label="Password" type="password" placeholder="Enter password"
            :error="errors.password" required />

          <BaseButton type="submit" :disabled="loading" class="mt-6">
            <span v-if="!loading">Continue To PIN</span>
            <span v-else class="flex items-center justify-center gap-2">
              <BaseLoader size="sm" />
              Signing in...
            </span>
          </BaseButton>

          <div class="text-center text-slate-600 dark:text-slate-400 text-sm mt-4">
            New to StockTrail?
            <router-link to="/auth/register/email" class="text-primary font-semibold hover:underline">Create
              account</router-link>
          </div>
        </form>

        <form v-else class="space-y-5" @submit.prevent="onPinSubmit">
          <BaseOtpInput ref="pinRef" v-model="pin" label="4-digit PIN" :num-inputs="4" input-type="number"
            inputmode="numeric" :error="errors.pin" required />

          <BaseButton :disabled="loading" type="submit" class="mt-6">
            <span v-if="!loading">Unlock Dashboard</span>
            <span v-else class="flex items-center justify-center gap-2">
              <BaseLoader size="sm" />
              Verifying PIN...
            </span>
          </BaseButton>

          <BaseButton type="button" variant="secondary" class="mt-3" @click="backToCredentials">
            Back to login
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- Template Ended -->
<!-- Style Started  -->

<style scoped></style>

<!-- Style Ended  -->
