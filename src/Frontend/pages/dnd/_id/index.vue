<template>
  <div/>
</template>

<script>
export default {
  mounted() {
    this.$router.replace("/dnd/" + this.$route.params.id + "/story");
  }
};
</script>

<style lang="scss" scoped>
</style>
