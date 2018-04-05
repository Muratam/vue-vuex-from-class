import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';

// classで書くことによってVueに依存せず使えるし,静的解析も可能になる
function getParams(func, isConstructor = false) {
  // コメントと空白を取り除いて正規化
  let source = func.toString().replace(/\/\/.*$|\/\*[\s\S]*?\*\/|\s/gm, '');
  if (!isConstructor) {
    // 最初の丸かっこのもの
    let params = source.match(/\((.*?)\)/)[1].split(',');
    if (params.length === 1 && params[0] === '') return [];
    return params;
  }
  let firstName = source.replace(/^.*?\{/, '').replace(/\(.*$/, '');
  console.assert(firstName === 'constructor', 'declare consturctor first!!');
  return getParams(func, false);
}
function getStatics(Class) {
  return Reflect.ownKeys(Class).filter(
      x => x !== 'length' && x !== 'prototype' && x !== 'name');
}
function getMethods(Class) {
  let funcs =
      Reflect.ownKeys(Class.prototype)
          .filter(x => x !== 'constructor')
          .map(x => [x, Reflect.getOwnPropertyDescriptor(Class.prototype, x)]);
  let res = {
    methods: [],
    getters: [],
    setters: [],
  };
  for (let [name, func] of funcs) {
    if (func.value) res.methods.push([name, func.value]);
    if (func.get) res.getters.push([name, func.get]);
    if (func.set) res.setters.push([name, func.set]);
  }
  return res;
}
function getMembers(instance) {
  return Reflect.ownKeys(instance);
}
function getName(Class) {
  return Class.name;
}

export function toVue(Class) {
  let res = {
    methods: {},
    computed: {},
  };
  // setup Methods and Computed
  let {methods, getters, setters} = getMethods(Class);
  getters =
      getters.map(([name, func]) => !name.startsWith('$$') ? [name, func] : [
        name,
        function() {
          let funcName = name.slice(2);
          return (funcName in this.$store.state) ?
              this.$store.state[funcName] :
              this.$store.getters[funcName];
        }
      ]);
  setters =
      setters.map(([name, func]) => !name.startsWith('$$') ? [name, func] : [
        name,
        function(value) {
          return this.$store.commit(name, value);
        }
      ]);
  for (let [name, func] of methods) res.methods[name] = func;
  for (let [name, func] of getters) res.computed[name] = {get: func};
  for (let [name, func] of setters) {
    if (name in res.computed)
      res.computed[name].set = func;
    else
      res.computed[name] = {set: func};
  }
  // setup components
  let statics = getStatics(Class);
  for (let s of statics) {
    if (s === 'components') res.components = Class[s]();
  }
  // setup props and data
  let props = getParams(Class);
  if (props.length !== 0) res.props = props;
  res.data = function() {
    let args = props.map(p => this[p]);
    let instance = new Class(...args);
    let members = getMembers(instance);
    let res = {};
    for (let m of members) res[m] = instance[m];
    return res;
  };
  return res;
}



export function toVuex(Class) {
  console.assert(
      getParams(Class).length === 0,
      'no arguments required for constructor of store !!');
  let res = {
    state: {},
    getters: {},
    mutations: {},
  };
  // methods
  let {methods, getters, setters} = getMethods(Class);
  for (let [name, func] of methods) {
    res.mutations[name] = function(state, args) {
      // this に state をバインドして展開して実行
      if (typeof (args) !== 'object')
        func.bind(state)(args);
      else
        func.bind(state)(...args);
    };
  }

  for (let [name, func] of getters) {
    res.getters[name] = function(state, getters) {
      for (let key of Reflect.ownKeys(state)) {
        getters[key] = state[key];
      }
      return func.bind(getters)();
    };
  }

  for (let [name, func] of setters) {
    console.assert(name.startsWith('$$'), 'setters without $$ are not allowed');
    res.mutations[name] = function(state, value) {
      state[name.slice(2)] = value;
    };
  }

  // state
  let instance = new Class();
  let members = getMembers(instance);
  for (let m of members) res.state[m] = instance[m];
  Vue.use(Vuex);
  return new Vuex.Store(res);
}