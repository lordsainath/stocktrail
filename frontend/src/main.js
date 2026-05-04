import { createApp } from 'vue'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { Toaster } from 'vue-sonner'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.component('Toaster', Toaster)

app.use(pinia)
app.use(router)

app.mount('#app')
