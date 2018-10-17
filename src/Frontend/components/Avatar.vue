<template>
  <div>
    <figure>
      <img @mouseover='mouseOver' :src='initial' alt='a lovely avatar!'>
      <figcaption>Avatar #{{this.avatarId}}</figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  props: ['avatarId'],
  data: () => ({
    initial: '/img/avatars/placeholder.png',
  }),
  methods: {
    mouseOver() {
      this.initial = `/img/avatars/${this.avatarId}.${this.avatarId < 8 ? 'png' : 'gif'}`;
    },
  },
};

</script>

<style lang="scss" scoped>
figure {
  margin: 0;
  figcaption {
    text-align: center;
  }
  img {
    width: 250px;
    height: 250px;
  }
}
</style>
