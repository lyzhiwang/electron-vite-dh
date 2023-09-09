import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import './samples/node-api';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './assets/dark/css-vars.css';
import './style.css';
import './styles/index.scss';


// import { updateHandle } from './utils/update';
// if (process.env.NODE_ENV === 'development') {
//   console.log('当前环境')
//   console.log('development')
// } else {
//   updateHandle();
// }

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
