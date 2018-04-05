<template lang="pug">
div
  hr
  p here is normal
  p Data: normalData :: {{ normalData }}
  p Method: toLower :: {{ toLower("IIKANJI") }}
  p Computed: normalDataLower :: {{ normalDataLower }}
  p Store : storeStateA:: {{ $$storeStateA }}
  button(@click="$$storeStateA = 'Normal_STORE_STATE_A'")
    p change store state A by Computed Method
  hr
  child(:propA="PROP_A")
</template>
<script>
import Child from "./child";
import { toVue } from "./tovue";

class Normal {
  constructor() {
    this.normalData = Normal.n() + "ORMAL_DATA";
  }
  toLower(str) {
    return str.toLowerCase() + this.normalData;
  }
  get normalDataLower() {
    return this.normalData.toLowerCase();
  }
  static components() {
    return { child: Child };
  }
  static n() {
    return "n";
  }
  get $$storeStateA() {}
  set $$storeStateA(_) {}
}
module.exports = toVue(Normal);
/*
module.exports = {
  methods: {
    toLower(str) {
      return str.toLowerCase() + this.normalData;
    }
  },
  computed: {
    normalDataLower() {
      return this.normalData.toLowerCase();
    },
    $$storeStateA: {
      get() {
        return this.$store.state.storeStateA;
      },
      set(value) {
        this.$store.commit("$$storeStateA", value);
      }
    }
  },
  data() {
    return {
      normalData: "NORMAL_DATA"
    };
  },
  components: {
    child: Child
  }
};
*/
</script>
<style scoped lang="less">

</style>