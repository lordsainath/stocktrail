import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { fetchWalletSummary, verifyTransactionPin as verifyTransactionPinRequest } from '../services/wallet.service';
import { formatCurrency } from '../utils/wallet';
import { getErrorMessage } from '../utils/error';


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

        return formatCurrency(walletBalance.value);
    });

    const fetchWalletBalance = async () => {
        try {
            walletLoading.value = true;

            const response = await fetchWalletSummary();

            walletBalance.value = response?.data?.data?.balance || 0;
            walletLoaded.value = true;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to fetch wallet balance'));
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

            await verifyTransactionPinRequest(walletPin.value);

            await fetchWalletBalance();

            walletVisible.value = true;
            showWalletPinModal.value = false;

            toast.success('Wallet amount is now visible');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Wallet PIN verification failed'));
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