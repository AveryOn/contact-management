
import './assets/main.css'
// PrimeFlex  (css-framework)
import '../node_modules/primeflex/primeflex.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// UI components
import UI from './components/UI';


import App from './App.vue'

const app = createApp(App);

// Глоабальная Регистрация UI копонентов
UI.forEach((comp) => {
    app.component(comp.name!, comp);
})

app
    .use(createPinia())
    .mount('#app')
