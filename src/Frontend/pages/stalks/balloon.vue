<template>
  <div class="balloon-page">
    <section>
      <h1>balloon</h1>
      <template v-if="!paused">
        <p>I am going to beep every 5 minutes and there's nothing you can do about it.</p>

        <button class="button full" @click.prevent="paused = true">But I don't want you to beep...</button>
      </template>
      <template v-else>
        <p>I'm not going to beep because you told me not to and I respect your feelings.</p>

        <button class="button full" @click.prevent="paused = false">Please beep again...</button>
      </template>



      <audio ref="audio">
        <source src="/sfx/click.ogg" type="audio/ogg">
      </audio>
    </section>

    <div ref="balloons" class="balloons">
      <div v-for="(balloon, i) of balloons" :key="i" :style="balloon.getStyle()" class="balloon"/>
    </div>
  </div>
</template>

<script>
import { CronJob } from 'cron';

const hues = ['0deg', '120deg) brightness(150%', '250deg', '60deg) brightness(387%) saturate(114%' ];

class Balloon {
  constructor() {
    this.height = 180;
    this.width = 100;
    // this.height = this.getRandomInt(100, 180);
    // this.width = this.getRandomInt(90, 110);
    this.x = 0;
    this.y = 0;
    this.vx = this.getRandomInt(20, 30);
    this.vy = this.getRandomInt(5, 10);

    this.transforms = {};
    this.filters = {
      'hue-rotate': hues[this.getRandomInt(0, hues.length - 1)]
    };
  }

  getTransforms() {
    const transforms = {
      ...this.transforms,
      scaleX: this.vx < 0 ? -1 : 1
    };
    const out = [];
    for (const key in transforms) {
      out.push(`${key}(${transforms[key]})`);
    }
    return out.join(' ');
  }

  getFilters() {
    const filters = {
      ...this.filters
      // 'hue-rotate': 90 + 'deg'
    };
    const out = [];
    for (const key in filters) {
      out.push(`${key}(${filters[key]})`);
    }
    return out.join(' ');
  }

  getStyle() {
    return {
      top: this.y + 'px',
      left: this.x + 'px',
      height: this.height + 'px',
      width: this.width + 'px',
      transform: this.getTransforms(),
      filter: this.getFilters(),
      'z-index': Math.max(0, this.y)
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1)) + min;
  }
}

export default {
  data() {
    return {
      job: null,
      paused: false,
      balloons: [],
      interval: null,
      height: 0,
      width: 0
    };
  },
  mounted() {
    if (this.job) {
      this.job.stop();
    }
    this.job = new CronJob('0 */5 * * * *', this.trigger.bind(this));
    this.job.start();

    this.interval = setInterval(this.update.bind(this), 1000);
  },
  destroyed() {
    this.job.stop();
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    trigger() {
      if (!this.paused) {
        this.$refs.audio.play();
        this.addBalloon();
      }
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max + 1)) + min;
    },

    addBalloon() {
      if (this.balloons.length < 20) {
        const balloon = new Balloon();

        let boundX = this.width - balloon.width;
        let boundY = this.height - balloon.height;

        if (this.getRandomInt(0, 1) === 0) {
          balloon.x = -balloon.width * 2;
        } else {
          balloon.x = boundX + balloon.width * 2;
        }

        balloon.y = this.getRandomInt(0, boundY);

        this.balloons.push(balloon);
      }
    },

    update() {
      if (this.paused) return;
      const el = this.$refs.balloons;
      if (el) {

        this.height = el.scrollHeight;
        this.width = el.scrollWidth;

        for (const balloon of this.balloons) {
          let boundX = this.width - balloon.width;
          let boundY = this.height - balloon.height;

          balloon.x += balloon.vx;
          balloon.y += balloon.vy;

          if (this.getRandomInt(0, 8) === 0) {
            balloon.vy *= -1;
          }

          if ((balloon.x < 0 && balloon.vx < 0) || (balloon.x > boundX && balloon.vx > 0)) {
            balloon.vx *= -1;

            // balloon.x = Math.max(Math.min(balloon.x, boundX), 0);
          }
          if ((balloon.y < 0 && balloon.vy < 0) || (balloon.y > boundY && balloon.vy > 0)) {
            balloon.vy *= -1;

            // balloon.y = Math.max(Math.min(balloon.y, boundY), 0);
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.balloon-page {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;

  section {
    // display: flex;
    // flex-direction: column;
    width: 100%;
    height: 100%;
  }

  p {
    text-align: center;
  }

}

.balloons {
  height: 100%;
  // border: 1px solid rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  flex: 1 0 auto;
  height: 100%;
  position: relative;
  overflow: hidden;

  .balloon {
    height: 180px;
    width: 100px;
    background-image: url(/img/stalks/balloon.png);
    background-size: 100% 100%;
    position: absolute;

    transition-duration: 1s;
    transition-timing-function: linear;
  }
}
</style>