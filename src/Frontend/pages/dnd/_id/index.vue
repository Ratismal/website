<template>
  <div/>
</template>

<script>
export default {
  mounted() {
    this.$router.replace(this.$route.params.id + "/story");
  }
};
</script>

<style lang="scss" scoped>
</style>
