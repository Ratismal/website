<template>
  <div>
    <figure>
      <img :src="initial" alt="a lovely avatar!" @mouseover="mouseOver">
      <figcaption>Avatar #{{ avatarId }}</figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  props: {
    avatarId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    initial: "/img/avatars/placeholder.png"
  }),
  methods: {
    mouseOver() {
      this.initial = `/img/avatars/${this.avatarId}.${
        this.avatarId < 8 ? "png" : "gif"
      }`;
    }
  }
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
