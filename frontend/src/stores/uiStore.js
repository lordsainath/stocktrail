// uiStore.js - Manages UI state such as sidebar visibility

// Imports

import { defineStore } from 'pinia';
import { ref } from 'vue';

// Definig the store
const useUiStore = defineStore('ui', () => {
  // State Initialization
  const isSidebarOpen = ref(false);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem('isSidebarOpen', isSidebarOpen.value);
  };

  // returning state and actions
  return { isSidebarOpen, toggleSidebar };
});

export default useUiStore;
