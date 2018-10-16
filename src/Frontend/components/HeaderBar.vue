<template>
  <header>
    <div class='flexbox'>
      <span class='title'>stupid cat</span>
      <div class='flexbox'>
        <nuxt-link to='/'>Main</nuxt-link>
        <nuxt-link to='/colors'>Colors</nuxt-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
}

.flexbox {
  display: flex;
  align-items: baseline;
  justify-content: space-around;

  & > * {
    margin: 0 10px;
  }
}

.title {
  font-size: 1.5em;
  text-align: center;
}
</style>
