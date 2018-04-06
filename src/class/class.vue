<template lang="pug">
div
  hr
  p here is class !!!
  p Data: classData :: {{ classData }}
  p Method: toLower :: {{ toLower("IIKANJI") }}
  p Computed: classDataLower :: {{ classDataLower }}
  p Store: storeStateA:: {{ $$storeStateA }}
  p Store: storeGetterB :: {{ $$storeGetterB }}
  button(@click="$$storeStateA = 'CLASS_STORE_STATE_A'")
    p change store state A by Computed Method
  hr
  child(:propA="'::PROP_A'")
</template>
<script>
import Child from "./child";
import { toVue } from "./tovue";
module.exports = toVue(
  class Class {
    constructor() {
      this.classData = Class.c() + "LASS_DATA";
    }
    toLower(str) {
      return str.toLowerCase() + this.classData;
    }
    get classDataLower() {
      return this.classData.toLowerCase();
    }
    static get components() {
      return { child: Child };
    }
    static c() {
      return "c";
    }
    get $$storeStateA() {}
    set $$storeStateA(_) {}
    get $$storeGetterB() {}
  }
);
</script>
<style scoped lang="less">

</style>