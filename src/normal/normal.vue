<template lang="pug">
div
  hr
  p here is normal
  p Data: normalData :: {{ normalData }}
  p Method: toLower :: {{ toLower("IIKANJI") }}
  p Computed: normalDataLower :: {{ normalDataLower }}
  p Store: storeStateA:: {{ $$storeStateA }}
  p Store: storeGetterB :: {{ $$storeGetterB }}
  button(@click="$$storeStateA = 'Normal_STORE_STATE_A'")
    p change store state A by Computed Method
  hr
  child(:propA="'::PROP_A'")
</template>
<script>
import Child from "./child";
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
    },
    $$storeGetterB() {
      return this.$store.getters.storeGetterB;
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
</script>
<style scoped lang="less">

</style>