import "@/assets/main.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import router from "@/routes";
import App from "@/App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { Tooltip } from "primevue";
import ToastService from "primevue/toastservice";
const app = createApp(App);

app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEUI_LICENSE,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.use(ToastService);
app.directive("tooltip", Tooltip);
app.use(router);
app.mount("#app");
