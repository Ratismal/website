<template>
  <div id="nuxt-wrapper" class="grey darken-4">
    <header-bar/>
    <nuxt/>
    <footer-bar/>
  </div>
</template>

<script>
import HeaderBar from "~/components/HeaderBar.vue";
import FooterBar from "~/components/FooterBar.vue";

export default {
  components: { HeaderBar, FooterBar }
};
</script>
