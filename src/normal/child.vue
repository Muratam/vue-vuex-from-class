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
module.exports = {
  methods: {},
  computed: {
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
    console.log(this);
    return {
      childData: "CHILD_DATA" + this.propA
    };
  },
  props: ["propA"]
};
</script>
<style scoped lang="less">

</style>