import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css';
import i18n from './language/i18n.ts';
import ElementPlus from 'element-plus'
import 'ant-design-vue/dist/reset.css';
import router from './router/index.ts';
import {createPinia} from 'pinia'
 

const app =  createApp(App)
const store = createPinia()

app.use(Vant)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
