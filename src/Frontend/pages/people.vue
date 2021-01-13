<template>
  <div :class="'theme-' + themes[theme]" class="ppls">
    <div class="layout">
      <div class="header" @click.prevent="changeTheme">
        <template v-if="theme > 0">
          {{ themes[theme] }}
        </template>
      </div>
      <div class="content">
        <div class="flex">
          <div class="total-in">
            <div class="key">Total in:</div>
            <div class="value">{{ inCount }}</div>
          </div>
          <div class="total-out">
            <div class="key">Total out:</div>
            <div class="value">{{ outCount }}</div>
          </div>
        </div>

        <div class="sum-wrapper">
          <div class="label">Number of people inside:</div>
          <div class="value">{{ sum }}</div>
        </div>

        <div class="buttons">
          <button class="button both" @click.prevent="clear">Clear Everything</button>
          <button class="button big" @click.prevent="increaseIn">IN</button>
          <button class="button big" @click.prevent="increaseOut">OUT</button>
        </div>

      </div>
      <div class="footer"/>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'custom',
  data() {
    return {
      theme: 0,
      themes: [
        'default',
        'inverted',
        'nord',
        'bee',
        'garfield',
        'luda',
        'froze',
        'melody',
        'cherry',
        'vessel',
        'clown-school',
        'mint'
      ],
      inCount: 0,
      outCount: 0
    };
  },
  computed: {
    sum() {
      return this.inCount - this.outCount;
    }
  },
  methods: {
    increaseIn() {
      this.inCount++;
    },
    increaseOut() {
      this.outCount++;
    },
    clear() {
      this.inCount = 0;
      this.outCount = 0;
    },
    changeTheme() {
      this.theme++;
      if (this.theme >= this.themes.length) {
        this.theme = 0;
      }
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: 'Futura Round';
  src: url('/fonts/Futura Round Medium.ttf');
}
@font-face {
  font-family: 'Futura';
  src: url('/fonts/futura medium bt.ttf');
}

html, body, #__nuxt, #__layout, #nuxt-wrapper, .ppls, .layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
}

.ppls {
  // display: none;
  background: var(--background-color);
  color: var(--foreground-color);
  font-size: 2rem;
  font-family: 'Futura Round';
}

:root {
  --foreground-color: blue;
  --border-color: blue;
  --background-color: red;
  --text-color: red;
}

.theme-inverted {
  --foreground-color: #ffff00;
  --border-color: #ffff00;
  --background-color: #00ffff;
  --text-color: #00ffff;
}

.theme-nord {
  --foreground-color: #d8dee9;
  --border-color: #2E3440;
  --background-color: #2E3440;
  --text-color: #d8dee9;
}

.theme-bee {
  --foreground-color: #ffff00;
  --border-color: #ffff00;
  --background-color: #000;
  --text-color: #000;
}

.theme-garfield {
  --foreground-color: #000;
  --border-color: #000;
  --background-color: #FDAA17;
  --text-color: #FDAA17;
}

.theme-luda {
  --foreground-color: #ABB9B5;
  --border-color: #7C9698;
  --background-color: url('https://stupid-cat.needs-to-s.top/9FfeJkk.png');
  --text-color: #ABB9B5;

  .button {
    background: url('https://cat.needs-to-s.top/75o9Lks.png') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
}

.theme-froze {
  --foreground-color: #212E77;
  --border-color: #212E77;
  --background-color: #687FFF;
  --text-color: #687FFF;
}

.theme-melody {
  --foreground-color: #92C5E9;
  --border-color: #92C5E9;
  --background-color: #D1FFF8;
  --text-color: #D1FFF8;
}

.theme-cherry {
  --foreground-color: #F06A81;
  --border-color: #F06A81;
  --background-color: #C41D1D;
  --text-color: #C41D1D;
}

.theme-vessel {
  --foreground-color: #93979F;
  --border-color: #93979F;
  --background-color: #3C3C3C;
  --text-color: #990000;
}

.theme-clown-school {
  --foreground-color: #09ff00;
  --border-color: #ff00ea;
  --background-color: #ffee00;
  --text-color: #00eeff;
}

.theme-mint {
  --foreground-color: #48dbaf;
  --border-color: #48dbaf;
  --background-color: #225345;
  --text-color: #225345;
}

.flex {
  display: flex;
  justify-content: space-between;
}

* {
  box-sizing: border-box;
  user-select: none;;
}

.layout {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--border-color);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 40px 1fr 40px;
  grid-template-areas:
    "header header"
    "content content"
    "footer footer";

  .header {
    grid-area: header;
    background: var(--border-color);
    color: var(--text-color);
    font-size: 0.8em;
    text-align: right;
    padding-right: 10px;
  }

  .footer {
    grid-area: footer;
    background: var(--border-color);
  }

  .content {
    background: var(--background-color);
    grid-area: content;
    margin: 2px;
    padding: 10px;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;

    & > * {
      flex: 1 0 auto;
    }
  }
}

.total-in, .total-out {
  font-weight: bold;

  .value {
    font-size: 1.2em;
    // margin: -10px 0;
  }
}

.total-out {
  text-align: right;
}

.sum-wrapper {
  font-weight: bold;
  text-align: center;

  .label {
    font-size: 0.95em;
  }

  .value {
    font-size: 3em;
    // margin: -10px 0;
  }
}

.buttons {
  flex: 0 0 auto !important;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 50px 120px;
  grid-gap: 20px;

  .both {
    grid-column-end: span 2;
  }

  & > * {
    min-width: 0;
    min-height: 0;
  }
}

.button {
  font-family: 'Futura';
  margin: 0;
  background: var(--foreground-color);
  color: var(--text-color);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 1.8rem;
  padding: 0;
  border-radius: 10px;

  &.big {
    font-size: 4.5rem;
    // padding: 30px 0;
    font-weight: bold;;
  }

  &:hover {
    background: var(--foreground-color);
  }
}
</style>