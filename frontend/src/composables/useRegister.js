import { storeToRefs } from 'pinia';
import { useRegisterStore } from '@stores/registerStore';

export function useRegister() {
  const registerStore = useRegisterStore();
  const { panStatus, panMessage, aadhaarStatus, aadhaarMessage, loading } =
    storeToRefs(registerStore);

  return {
    formData: registerStore.formData,
    panStatus,
    panMessage,
    aadhaarStatus,
    aadhaarMessage,
    loading,
    checkEmail: registerStore.checkEmail,
    checkUsername: registerStore.checkUsername,
    schedulePanVerification: registerStore.schedulePanVerification,
    scheduleAadhaarVerification: registerStore.scheduleAadhaarVerification,
    submitRegistration: registerStore.submitRegistration,
    verifyOtpCode: registerStore.verifyOtpCode,
    setPinCode: registerStore.setPinCode,
    resetRegisterForm: registerStore.resetRegisterForm,
  };
}

export default useRegister;
