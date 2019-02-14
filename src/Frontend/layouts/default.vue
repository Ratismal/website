<template>
  <div id="nuxt-wrapper" class="grey darken-4">
    <header-bar/>
    <nuxt/>
    <footer-bar/>
    <toaster ref="toaster"/>
  </div>
</template>

<script>
import HeaderBar from "~/components/HeaderBar.vue";
import FooterBar from "~/components/FooterBar.vue";
import Toaster from "~/components/Toaster.vue";

export default {
  components: { HeaderBar, FooterBar, Toaster }
};
</script>
