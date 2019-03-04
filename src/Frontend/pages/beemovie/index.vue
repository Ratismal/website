<template>
  <main class="catflex vertical">
    <div class="beemovie"/>
    <div class="catflex horizontal around content-wrapper">
      <transition-group class="line-wrapper catflex vertical" tag="div">
        <div v-for="(line, i) in currentLines" :key="line.key" :class="['line', 'line-' + i]">
          <div class="line-inner-wrap catflex vertical">
            <span class="actor">{{ !line.type ? line.actor : types[line.type] }}</span>
            <span class="content">{{ line.content }}</span>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="button-bar catflex horizontal around">
      <div class="button-bar-inner-wrap catgrid">
        <button class="button col s6" @click.prevent="move(false)">Previous</button>
        <button class="button col s6" @click.prevent="move(true)">Next</button>
        <span class="col s2 center">
          {{ currentIndex + 1 }} / {{ lines.length }}
        </span>
        <progress :max="lines.length" :value="currentIndex" class="script-progress col s10">
          {{ Math.floor(lines.length / (currentIndex + 1)) }}%
        </progress>
      </div>
    </div>
    <div v-if="gotoEnabled" class="goto-modal catflex vertical">
      <input v-model="gotoIndex" type="number">
      <button class="button" @click.prevent="gotoModal">Go</button>
    </div>
  </main>
</template>

<script>
import beemovie from "~/assets/json/formattedBeemovie.json";
import { setTimeout } from "timers";

export default {
  data() {
    let i = 0;
    beemovie.forEach(l => (l.key = ++i));
    return {
      lines: beemovie,
      // currentIndex: 0,
      negKeys: -3,
      currentLines: [
        { key: -1 },
        { key: -2 },
        beemovie[0],
        beemovie[1],
        beemovie[2]
      ],
      gotoEnabled: false,
      gotoIndex: 0,
      types: ["NORMAL", "SYSTEM", "TECHNICAL", "ACTION"],
      hotkeys: {
        n: {
          func: () => {
            this.move(true);
          },
          desc: "Next"
        },
        b: {
          func: () => {
            this.move(false);
          },
          desc: "Previous"
        },
        g: {
          func: () => {
            this.gotoIndex = this.currentIndex + 1;
            this.gotoEnabled = true;
          },
          desc: "Go To"
        }
      }
    };
  },
  layout: "custom",
  computed: {
    currentIndex() {
      return this.lines.indexOf(this.currentLines[2]);
    }
    // currentLines() {
    //   let i = -10;
    //   let start = this.currentIndex - 1;
    //   let prepend = [];
    //   if (start < 0) {
    //     for (let j = 0; j < Math.abs(start); j++) {
    //       prepend.push({ content: "", actor: "", type: 0, key: i++ });
    //     }
    //     start = 0;
    //   }
    //   let append = [];
    //   let end = this.currentIndex + 2;
    //   if (end >= this.lines.length) {
    //     for (let j = 0; j < end - this.lines.length; j++) {
    //       prepend.push({ content: "", actor: "", type: 0, key: i++ });
    //     }
    //     end = this.lines.length;
    //   }
    //   return [...prepend, ...this.lines.slice(start, end), ...append];
    // }
  },
  mounted() {
    document.addEventListener("keydown", e => {
      if (e.ctrlKey) {
        if (this.handleKeypress(e)) {
          // console.log("Preventing default.");
          e.preventDefault();
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        this.move(false);
        e.preventDefault();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        this.move(true);
        e.preventDefault();
      }
    });
  },
  methods: {
    handleKeypress(e) {
      if (this.hotkeys[e.key]) {
        this.hotkeys[e.key].func(e);
        return true;
      }
      // console.log('Was not handled');
      return false;
    },
    move(forward = true) {
      // this.currentIndex = Math.max(
      //   0,
      //   Math.min(this.lines.length - 1, this.currentIndex + (forward ? 1 : -1))
      // );
      if (forward && this.currentIndex < this.lines.length - 1) {
        this.currentLines.shift();
        this.currentLines.push(
          this.lines[this.currentIndex + 2] || { key: this.negKeys-- }
        );
      } else if (!forward && this.currentIndex > 0) {
        this.currentLines.pop();
        this.currentLines.unshift(
          this.lines[this.currentIndex - 3] || { key: this.negKeys-- }
        );
      }
    },
    sleep(time = 0) {
      return new Promise(res => {
        setTimeout(res, time);
      });
    },
    async goto(index = 0) {
      let i = Math.max(0, Math.min(this.lines.length - 1, index));
      let diff = Math.abs(this.currentIndex - index);
      let forward = index > this.currentIndex;
      while (this.currentIndex !== i) {
        this.move(forward);
        if (diff < 50) await this.sleep(0);
      }
    },
    gotoModal() {
      this.gotoEnabled = false;
      this.goto(this.gotoIndex - 1);
    }
  },
  head: {
    title: "Bee Movie Script",
    link: [{ rel: "icon", type: "image/x-icon", href: "/img/thinkingBEE.png" }]
  }
};
</script>


<style lang="scss" scoped>
.line {
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  width: 700px;
  height: 200px;

  transition: 1s ease;
  // transition: transform 0.3s ease-in-out, opacity 0.5s;

  &.line-0 {
    opacity: 0;
    height: 0;
    padding: 0 1rem;
    margin: 0;
    transform: translateY(-150px) scale(0.8) rotate3d(1, 0, 0, 45deg);
  }

  &.line-1 {
    opacity: 0.5;
    transform: rotate3d(1, 0, 0, 45deg);
  }

  &.line-2 {
    opacity: 1;
    transform: scale(1.2);
  }

  &.line-3 {
    opacity: 0.5;
    transform: rotate3d(1, 0, 0, -45deg);
  }

  &.line-4 {
    opacity: 0;
    height: 0;
    padding: 0 1rem;
    margin: 0;
    transform: scale(0.8) rotate3d(1, 0, 0, -45deg);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }

  &.selected {
    background: rgba(0, 0, 0, 0.6);
  }

  .id {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8em;
  }

  .actor {
    font-size: 1.6em;
  }

  .content {
    white-space: pre-wrap;
  }
}

.button-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  .button-bar-inner-wrap {
    width: 650px;
    margin: 1rem;

    .script-progress {
      width: 100%;

      -webkit-appearance: none;
      appearance: none;
    }
  }
}

.content-wrapper {
  height: 100%;
  perspective: 800px;
  overflow: hidden;
}

.beemovie {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.2;
  filter: grayscale(50%) blur(5px);
  animation: barry 120s infinite;
  // z-index: -100;
  background-image: url("/img/barrybenson.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

@keyframes barry {
  0% {
    filter: grayscale(50%) blur(5px) hue-rotate(0deg);
  }
  50% {
    filter: grayscale(50%) blur(10px) hue-rotate(180deg);
  }
  100% {
    filter: grayscale(50%) blur(5px) hue-rotate(360deg);
  }
}

.goto-modal {
  position: fixed;
  top: 200px;
  width: 300px;
  background: black;
  border-radius: 8px;
  margin: 0 auto;
}
</style>
