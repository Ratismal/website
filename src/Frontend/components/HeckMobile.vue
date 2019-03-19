<template>
  <div v-if="!accepted" class="heck-mobile only-s catflex vertical around">
    <div class="catflex vertical around">
      <h1>This page is not optimized for mobile.</h1>
      <p class="center">If it doesn't display properly, use a better device.</p>
      <button class="button" @click.prevent="accepted = true">I understand</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accepted: false
    };
  }
};
</script>

<style lang="scss" scoped>
.heck-mobile {
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: black;
  padding: 2rem;
}
</style>
