import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loaded: true,
    trimester: null, // 持久化
    backend: null, // 持久化
    showIntroductionNotification: true,
  },
  getters: {
    scheduleTableRows() {
      // 课程表格
      let rows = [];
      for (let i = 0; i < 7; i++) {
        rows.push([null,null,null,null,null,null,null])
      }
      return rows;
    },
  },
  mutations: {
    LOADED(state, value) {
      state.loaded = value;
    },
    TRIMESTER(state, value) {
      state.trimester = value;
    },
    IGNORE_INTRODUCTION_NOTIFICATION(state) {
      state.showIntroductionNotification = false;
    },
  },
  actions: {
  },
});


