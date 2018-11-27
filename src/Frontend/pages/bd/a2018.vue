<template>
  <div class="dialogue-wrapper">
    <div :style="background" class="background"/>

    <div class="dialogue-box">
      <div v-if="title" class="title">
        {{ title }}
      </div>
      <div class="text"><!--
        --><span v-for="part in preview" :key="part.iid" :class="getClass(part)"><!--
          -->{{ part.text }}<!--
        --></span><!--
      --></div>
    </div>

    <div class="button-group" >
      <button class="button" @click.prevent="nextClick">
        next
      </button>
    </div>
  </div>
</template>

<script>
import data from "@/assets/bd/a2018.json";

export default {
  layout: "custom",
  data() {
    return {
      preview: [],
      data,
      title: "",
      line: "",
      statementTypes: {
        NORMAL: "Normal",
        KEY: "Key Statement",
        WEAK: "Weakpoint",
        SYSTEM: "System Statement",
        INTERNAL: "Internal Statement"
      },
      playing: false,
      speedModifier: 1,
      background: {
        "background-image": ""
      }
    };
  },
  computed: {},
  mounted() {
    let line = this.data.lines[0];
    this.line = line.id;
    console.log(line);
    this.writePreview();
  },
  methods: {
    getClass(part) {
      let c = ["line-part"];
      if (part.type) c.push("type-" + part.type);
      return c;
    },
    sleep(time = 100) {
      return new Promise(res => {
        setTimeout(res, time / this.speedModifier);
      });
    },
    async writePreview() {
      this.speedModifier = 1;
      this.playing = true;
      this.preview = [];
      const line = this.findLine(this.line);
      if (!line) return;
      if (line.background) {
        this.background["background-image"] = `url(${line.background})`;
      }
      console.log(this.background);
      this.title = this.data.characters[line.character].name || line.title;

      for (const part of line.parts) {
        console.log(part);
        let l = {
          type: part.type.toLowerCase(),
          iid: part.iid,
          text: ""
        };
        this.preview.push(l);
        part.text = part.text.replace(/\\n/g, "\n");

        let c = 0;
        for (const char of part.text) {
          l.text += char;
          if (++c < part.text.length) await this.sleep(Number(part.speed));
        }
        if (part.delay) {
          await this.sleep(Number(part.delay));
        }
      }
      this.line = line.goto;
      this.playing = false;
      this.speedModifier = 1;
    },
    findLine(key) {
      return this.data.lines.find(l => l.id === key);
    },
    nextClick(event) {
      if (!this.playing) {
        this.writePreview();
      } else {
        this.speedModifier = 8;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P");

.background {
  background-color: rgba(0, 0, 0, 0.3);
  height: 576px;
  width: 1024px;
  border: rgba(0, 0, 0, 0.8) 4px solid;
  margin: 10px auto 0 auto;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.dialogue-box {
  flex: 0 0 600px;
  max-width: 600px;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  height: 175px;
  border-radius: 5px;
  padding: 30px 20px;
  font-size: 16px;
  margin: -150px auto 0 auto;
  box-sizing: border-box;

  .title {
    position: absolute;
    font-family: "Press Start 2P";
    top: -26px;
    background: rgba(0, 0, 0, 0.5);
    display: block;
    padding: 10px 15px;
    font-size: 28px;
    user-select: none;
    cursor: default;
  }
  .text {
    font-family: "Press Start 2P";
    line-height: 28px;
    font-size: 16px;
    white-space: pre;

    .line-part {
      white-space: trim-inner;
      cursor: default;
      user-select: none;

      &.type-key {
        color: rgb(218, 188, 42);
      }

      &.type-weak {
        color: rgb(149, 36, 149);
        cursor: pointer;

        &:hover {
          color: rgb(202, 54, 202);
        }
      }

      &.type-system {
        color: rgb(54, 199, 54);
      }

      &.type-internal {
        color: rgb(73, 75, 192);
      }
    }
  }
}

.button-group {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  max-width: 600px;

  .button {
    flex: 1 0 auto;
    padding: 15px;
    background: rgba(0, 180, 100, 0.7);
    outline: none;
    border: none;
    color: white;
    font-family: "Press Start 2P";

    &:hover {
      background: rgba(0, 180, 100, 0.9);
    }
  }
}
</style>
