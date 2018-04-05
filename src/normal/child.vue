<template lang="pug">
div
  hr
  p here is child
  p Data: childData :: {{ childData }}
  p Store : storeStateA:: {{ $$storeStateA }}
  button(@click="$$storeStateA = 'Child_STORE_STATE_A'")
    p change store state A by Computed Method @ child
  hr
</template>
<script>
import { toVue } from "./tovue";
module.exports = toVue(
  class Child {
    constructor(propA) {
      this.childData = "CHILD_DATA" + propA;
    }
    get $$storeStateA() {}
    set $$storeStateA(_) {}
  }
);
</script>
<style scoped lang="less">

</style>