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
 
const store = createPinia()

createApp(App).use(Vant).use(i18n).use(ElementPlus).use(router).use(store).mount('#app')
