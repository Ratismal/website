<template>
  <div class="avatar">
    <div v-if="canAnimate && !showAnimation" class="animation-indicator">
      GIF
    </div>
    <figure>
      <picture @mouseover="mouseOver" @mouseout="mouseOut">
        <template v-if="showAnimation">
          <source :srcset="webp" type="image.webp">
          <source :srcset="gif" type="image/gif">
        </template>
        <img :src="png" alt="a lovely avatar!" >
      </picture>
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
    animate: false
  }),
  computed: {
    canAnimate() {
      return this.avatarId >= 8;
    },
    showAnimation() {
      return this.canAnimate && this.animate;
    },
    base() {
      return `/img/avatars/${this.avatarId}`;
    },
    png() {
      return this.base + '.png';
    },
    gif() {
      return this.base + '.gif';
    },
    webp() {
      return this.base + '.webp';
    }
  },
  methods: {
    mouseOver() {
      this.animate = true;
    },
    mouseOut() {
      this.animate = false;
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

.avatar {
  position: relative;

  .animation-indicator {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0.5rem;
    font-size: 0.8em;
    text-transform: uppercase;
    padding: 2px 4px;
  }
}
</style>
