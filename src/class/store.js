import Vue from 'vue/dist/vue.esm.js';
import {toVuex} from './tovue';
export default toVuex(class Store {
  constructor() {
    this.storeStateA = 'STORE_STATE_A';
  }
  // 本来 mutation用なのでここでは getter は操作できない.
  add() {
    this.storeStateA = this.storeStateA + 'A';
  }
  addArg(args) {
    this.storeStateA = this.storeStateA + args;
  }

  get storeGetterFunc() {
    return arg => arg;
  }
  get storeGetterA() {
    return 'STORE_GETTER_A';
  }
  get storeGetterB() {
    return this.storeGetterFunc('hoge') + this.storeStateA + this.storeGetterA +
        ' : STORE_GETTER_B';
  }
  // 代入用外部公開mutationを自動で生成
  set $$storeStateA(_) {}
});

/*
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
*/