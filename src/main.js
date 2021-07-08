import { createApp } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/index'
const app = createApp(App)
app.use(router)
app.provide("$msg", ElMessage)
app.use(ElementPlus)
app.mount('#app')

