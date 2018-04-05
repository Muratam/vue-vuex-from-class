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