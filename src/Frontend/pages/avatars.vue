<template>
  <main>
    <section>
      <h1>Avatars</h1>
      <p>This is a collection of all the avatars I've made and used. For your convenience, images will only
        <!-- -->display when you hover over them!</p>
    </section>
    <div class='flexbox'>
      <avatar v-for='n in total' :key='n' :avatar-id='n' />
    </div>
  </main>
</template>

<script>
import Avatar from '~/components/Avatar.vue';

export default {
  data: () => ({
    total: 30,
  }),
  components: { Avatar },
};
</script>

<style lang="scss" scoped>
.flexbox {
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 15px;
  }
}
</style>
