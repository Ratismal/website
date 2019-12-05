<template>
  <div>
    <footer class="pwa-footer">
      <div class="button-bar">
        <button class="butt">
          <i class="material-icons" @click.prevent="goBack">arrow_back</i>
        </button>
        <button class="butt">
          <i class="material-icons" @click.prevent="goHome">home</i>
        </button>
        <button class="butt">
          <i class="material-icons" @click.prevent="goForward">arrow_forward</i>
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/pwa");
    },
    goBack() {
      this.$router.go(-1);
    },
    goForward() {
      this.$router.go(1);
    }
  }
};
</script>

<style lang="scss">
.pwa-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;

  .button-bar {
    display: flex;
    justify-content: center;

    .butt {
      height: 70px;
      width: 70px;
      background: rgba(255, 255, 255, 0);
      outline: none;
      border: none;
      text-align: center;

      i {
        font-size: 48px;
        color: white;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
