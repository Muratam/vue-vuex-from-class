# Vue Vuex from class

This is an experimental module.

use
https://github.com/Muratam/vue-vuex-from-class/blob/master/src/class/tovue.js

like
`import {toVue,toVuex} from "./tovue.js";`

# try

- install
  - `$ npm i`
- test normal vue project
  - `$ npm run normal`
- test class-based vue project
  - `$ npm run class`
- run server
  - `$ cd dist && php -S localhost:1234`

# difference of vue
normal vue (not fun)
```js
({
  data() { return { normalData: "NORMAL_DATA" };},
  components: { child: Child }
  methods: {
    toLower(str) { return str.toLowerCase() + this.normalData; }
  },
  computed: {
    normalDataLower() { return this.normalData.toLowerCase(); },
    $$storeStateA: {
      get() { return this.$store.state.storeStateA; },
      set(value) { this.$store.commit("$$storeStateA", value); }
    },
    $$storeGetterB() { return this.$store.getters.storeGetterB; }
  },
});
```

... is same as this class based vue (so fun !!)

```js
toVue(
  class {
    constructor() { this.classData = "CLASS_DATA"; }
    static components() { return { child: Child }; }
    toLower(str) { return str.toLowerCase() + this.classData; }
    get classDataLower() { return this.classData.toLowerCase();}
    get $$storeStateA() {}
    set $$storeStateA(_) {}
    get $$storeGetterB() {}
  }
)
```

# difference of vuex

normal vuex (not fun)
```js
new Vuex.Store({
  state: { storeStateA: 'STORE_STATE_A' },
  mutations: {
    add(state) { state.storeStateA = state.storeStateA + 'A'; },
    addArg(state, args) { state.storeStateA = state.storeStateA + args;},
    $$storeStateA(state, arg) { state.storeStateA = arg;}
  }
  getters: {
    storeGetterFunc: (state, getters) => arg => { return arg; },
    storeGetterA: (state, getters) => { return 'STORE_GETTER_A';},
    storeGetterB: (state, getters) => {
      return getters.storeGetterFunc('HOGE') +
          state.storeStateA + getters.storeGetterA + ': STORE_GETTER_B';
    }
  },
})
```

... is same as this class based vuex (so fun !!)
```js
toVuex(class {
  constructor() { this.storeStateA = 'STORE_STATE_A'; }
  add() { this.storeStateA = this.storeStateA + 'A'; }
  addArg(args) { this.storeStateA = this.storeStateA + args;}
  set $$storeStateA(_) {}
  get storeGetterFunc() { return arg => arg; }
  get storeGetterA() { return 'STORE_GETTER_A'; }
  get storeGetterB() {
    return this.storeGetterFunc('hoge') +
        this.storeStateA + this.storeGetterA + ' : STORE_GETTER_B';
  }
});
```

# difference of vue component
normal vue component (not fun)

```js
({
  props: ["propA"]
  data() { return { childData: "CHILD_DATA" + this.propA }; },
  computed: {
    $$storeStateA: {
      get() { return this.$store.state.storeStateA; },
      set(value) { this.$store.commit("$$storeStateA", value); }
    }
  },
})
```

... is same as this class based vue component (so fun !!)

```js
toVue(
  class Child {
    constructor(propA) { this.childData = "CHILD_DATA" + propA; }
    get $$storeStateA() {}
    set $$storeStateA(_) {}
  }
);
```
