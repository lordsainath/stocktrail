// ===================================
// IMPORTS
// ===================================

import './style.css';
import 'vue-sonner/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Toaster } from 'vue-sonner';
import App from './App.vue';
import router from './router';

// ===================================
// APP SETUP
// ===================================
const app = createApp(App);

// ===================================
// PINIA SETUP
// ===================================
const pinia = createPinia();

// ===================================
// GLOBAL COMPONENTS
// ===================================
app.component('Toaster', Toaster);

// Register pinia for state maanagement and router for navigation
app.use(pinia);
app.use(router);

// mount the app to #app element in index.html
app.mount('#app');
