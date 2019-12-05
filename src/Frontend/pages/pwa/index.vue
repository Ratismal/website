<template>
  <main>
    <section>
      <h1>stupid cat's super cool web app</h1>
      <div class="flexbox">
        <nuxt-link to="/pwa/worklog" class="button">Worklog</nuxt-link>
        <nuxt-link to="/pwa/ffx/arena" class="button">FFX Arena</nuxt-link>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {};
  },
  layout: "pwa",
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
