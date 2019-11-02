import Vue from "vue";
// bootstrap-vue ui 框架
import BootstrapVue from "bootstrap-vue";
// 当有新的内容添加的时候，自动滚动到内容区底部
import VueChatScroll from "vue-chat-scroll";

import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入相应的样式文件
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/loading.css";
import "./assets/css/loading-btn.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueChatScroll);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
