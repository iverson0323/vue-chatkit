import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

// 开启vuex debug模式，非生产环境
const debug = process.env.NODE_ENV !== "production";

// 初始化VuexPersistence，作为vuex插件的使用
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

// 初始化vuex store
export default new Vuex.Store({
  state: {
    loading: false,
    sending: false,
    error: null,
    user: [],
    reconnect: false,
    activeRoom: null,
    rooms: [],
    users: [],
    messages: [],
    userTyping: null
  },
  getters: {
    hasError: state => (state.error ? true : false)
  },
  mutations,
  actions,
  // vuexLocal.plugin作为plugin使用
  plugins: [vuexLocal.plugin],
  // debug开启
  strict: debug
});
