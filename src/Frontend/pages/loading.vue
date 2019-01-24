<template>
  <main :style="{background:color}">
    <div class="container middle">
      <img src="/img/loading.webp" class="loading">
      <span class="line">Working on updates &nbsp; <span id="percent">{{ percent }}%</span></span>
      <span class="line">Don't turn off your PC. This will take a while.</span>
    </div>
    <div :style="{paddingBottom: margin + 'px'}" class="container bottom">
      <span class="line">Your PC will restart several times.</span>
    </div>
  </main>
</template>

<script>
export default {
  layout: "custom",
  asyncData({ route }) {
    let obj = {
      color: "#000000",
      staticColor: false,
      margin: 0,
      interval: null,
      percent: 0,
      initialized: false,
      colorLimit: 256 / 4 * 3,
      intervalDuration: 60
    };
    if (route.query.interval) {
      let interval = parseInt(route.query.interval);
      if (!isNaN(interval)) obj.intervalDuration = interval;
    }
    if (route.query.color) {
      let color = route.query.color;
      if (/^([a-f0-9]{6}|[a-f0-9]{3})$/i.test(color)) color = "#" + color;
      obj.staticColor = true;
      obj.color = color;
    } else {
      let randInt = max => Math.floor(Math.random() * max);
      const _color = [
        randInt(obj.colorLimit),
        randInt(obj.colorLimit) << 8,
        randInt(obj.colorLimit) << 16
      ];
      obj.color = "#" + _color.reduce((a, b) => a + b, 0).toString(16);
    }

    if (route.query.margin) {
      let margin = parseInt(route.query.margin);
      if (!isNaN(margin)) obj.margin = margin;
    }

    const cur = new Date();
    const reference = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate()
    );
    let diff = cur - reference;
    obj.percent = Math.floor(diff / (1000 * 60 * 60 * 24) * 100);

    return obj;
  },
  mounted() {
    this.interval = setInterval(
      this.intervalFunc,
      1000 * this.intervalDuration
    );
  },
  methods: {
    randInt(max) {
      return Math.floor(Math.random() * max);
    },
    generateColor() {
      const _color = [
        this.randInt(this.colorLimit),
        this.randInt(this.colorLimit) << 8,
        this.randInt(this.colorLimit) << 16
      ];
      return "#" + _color.reduce((a, b) => a + b, 0).toString(16);
    },
    intervalFunc() {
      this.getPercent();
      if (!this.staticColor) {
        this.color = this.generateColor();
      }
    },
    getPercent() {
      const cur = new Date();
      const reference = new Date(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate()
      );
      let diff = cur - reference;
      this.percent = Math.floor(diff / (1000 * 60 * 60 * 24) * 100);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  color: white;
  user-select: none;
}

.line {
  font-family: "Segoe UI";
  font-size: 1.5rem;
  text-align: center;
  display: block;
  width: 100%;
  margin: 0 0 5px 0;
}

main {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  transition: background 5s;
}

.middle {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom {
  flex: 0 1 auto;
  width: 100%;
}

.bottom .line {
  margin: 10px;
}

.loading {
  height: 128px;
  width: 128px;
}
</style>
