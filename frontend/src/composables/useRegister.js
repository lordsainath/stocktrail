import { reactive } from "vue";
import apiClient from "../services/axios";
import { toast } from "vue-sonner";


const formData = reactive({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    username: "",
    address: {
        line1: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    },
    panNumber: "",
    aadhaarNumber: "",
    otp: "",
    pin: "",
})


const checkUsername = async () => {
    try {
        const response = await apiClient.post('/auth/check-username', { username: formData.username });
        if (response.data?.data?.available) {
            toast.success(response.data.data.message);
            return true;
        } else {
            const msg = response.data?.data?.message || 'Username not available';
            toast.error(msg);
            throw new Error(msg);
        }

    } catch (error) {
        console.error("Error checking username:", error);
        const msg = error?.response?.data?.message || error?.message || "Internal Server Error";
        throw new Error(msg);
    }
}

const resetRegisterForm = () => {
    formData.email = "";
    formData.name = "";
    formData.password = "";
    formData.confirmPassword = "";
    formData.username = "";
    formData.address.line1 = "";
    formData.address.city = "";
    formData.address.state = "";
    formData.address.country = "";
    formData.address.pincode = "";
    formData.panNumber = "";
    formData.aadhaarNumber = "";
    formData.otp = "";
    formData.pin = "";
};



export function useRegister() {
    return {
        formData,
        checkUsername,
        resetRegisterForm,
    }
}