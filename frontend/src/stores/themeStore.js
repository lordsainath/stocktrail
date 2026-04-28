import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {

    // theme initialization
    const theme = ref(localStorage.getItem('theme') || 'light');


    // watcher to update theme in localstorage and add dark tailwind css class to document root
    watch(theme, (value) => {
        console.log('Theme changed to : ', value);
        localStorage.setItem('theme', value);

        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

    }, { immediate: true })


    // Theme toggle function - [dark <-> light]
    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    };

    return { theme, toggleTheme }
})