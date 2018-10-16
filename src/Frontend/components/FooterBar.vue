<template>
  <footer>
    <div class='flexbox'>
      <span>Copyright &copy; {{getYear()}}</span>
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    getYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss" scoped>
.flexbox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 100%;

  & > * {
    flex: 0 0 auto;
  }
}
</style>
