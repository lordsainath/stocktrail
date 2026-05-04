import { defineStore } from "pinia";
import { ref } from "vue"



const useUiStore = defineStore("ui", () => {
    const isSidebarOpen = ref(false);

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
        localStorage.setItem('isSidebarOpen', isSidebarOpen.value);
    }

    return { isSidebarOpen, toggleSidebar }
})

export default useUiStore;