import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import apiClient from '../services/axios';


export function useWallet() {
    const walletBalance = ref(0);
    const walletLoaded = ref(false);
    const walletVisible = ref(false);
    const walletLoading = ref(false);

    const showWalletPinModal = ref(false);
    const walletPin = ref('');
    const verifyingWalletPin = ref(false);

    const walletDisplay = computed(() => {
        if (!walletVisible.value) return 'USD •••••';
        if (!walletLoaded.value) return 'Loading...';

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(walletBalance.value || 0);
    });

    const fetchWalletBalance = async () => {
        try {
            walletLoading.value = true;

            const response = await apiClient.get('/wallet/summary');

            walletBalance.value = response?.data?.balance || 0;
            walletLoaded.value = true;
        } catch (error) {
            toast.error(error);
        } finally {
            walletLoading.value = false;
        }
    };

    const toggleWalletVisibility = async () => {
        if (walletVisible.value) {
            walletVisible.value = false;
            return;
        }

        walletPin.value = '';
        showWalletPinModal.value = true;
    };

    const verifyWalletPin = async () => {
        if (!/^\d{4}$/.test(walletPin.value)) {
            toast.error('Please enter a valid 4-digit PIN');
            return;
        }

        try {
            verifyingWalletPin.value = true;

            await apiClient.post('/auth/verify-transaction-pin', {
                pin: walletPin.value,
            });

            await fetchWalletBalance();

            walletVisible.value = true;
            showWalletPinModal.value = false;

            toast.success('Wallet amount is now visible');
        } catch (error) {
            toast.error(error);
        } finally {
            verifyingWalletPin.value = false;
        }
    };

    const closeWalletPinModal = () => {
        showWalletPinModal.value = false;
    };

    return {
        walletBalance,
        walletLoaded,
        walletVisible,
        walletLoading,
        showWalletPinModal,
        walletPin,
        verifyingWalletPin,
        walletDisplay,
        fetchWalletBalance,
        toggleWalletVisibility,
        verifyWalletPin,
        closeWalletPinModal,
    };
}

export default useWallet;