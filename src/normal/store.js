import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    storeStateA: 'STORE_STATE_A',
  },
  getters: {
    storeGetterFunc: (state, getters) => arg => {
      return arg;
    },
    storeGetterA: (state, getters) => {
      return 'STORE_GETTER_A';
    },
    storeGetterB: (state, getters) => {
      return getters.storeGetterFunc('HOGE') + state.storeStateA +
          getters.storeGetterA + ': STORE_GETTER_B';
    }
  },
  mutations: {
    add(state) {
      state.storeStateA = state.storeStateA + 'A';
    },
    addArg(state, args) {
      state.storeStateA = state.storeStateA + args;
    },
    $$storeStateA(state, arg) {
      state.storeStateA = arg;
    }
  }
})