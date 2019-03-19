<template>
  <div id="toaster">
    <!-- meow -->
    <div v-for="toast in toasts" :key="toast.id" :class="toast.classes">
      <div class="toast-inner">
        <div>{{ toast.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toasts: [],
      id: 0
    };
  },
  mounted() {
    this.$root.$on("toast", (text, time) => {
      this.addToast(text, time);
    });
  },
  methods: {
    async addToast(text, time = 5000) {
      let id = ++this.id;
      let toast = {
        id,
        text,
        classes: {
          toast: true,
          on: true,
          off: false
        },
        remove: () => {
          this.removeToast(id);
        }
      };
      this.toasts.push(toast);
      setTimeout(() => {
        this.removeToast(id);
      }, time);

      this.sleep().then(() => {
        toast.classes.on = false;
      });
    },
    sleep(time = 500) {
      return new Promise(res => {
        setTimeout(res, time);
      });
    },
    async removeToast(id) {
      let toast = this.toasts.find(t => t.id === id);
      if (toast) {
        toast.classes.off = true;
        await this.sleep();

        let index = this.toasts.indexOf(toast);
        this.toasts.splice(index, 1);
      }
    }
  }
};
</script>


<style lang="scss" scoped>
#toaster {
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  // background: black;
  width: 100%;
  max-width: 450px;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  user-select: none;
  pointer-events: none;
}

.toast {
  display: block;
  background: rgba(0, 0, 0, 0.6);
  margin: 0.5rem 0;
  overflow: hidden;
  height: 75px;
  transition: height 0.5s ease-in-out, margin 0.5s ease-in-out;

  &.on {
    height: 0px;
    margin: 0;
  }
  &.off {
    height: 0px;
    margin: 0;
  }

  .toast-inner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
