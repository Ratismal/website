<template>
  <main>
    <section>
      <h1>CSS Colors</h1>
      <p>These are the CSS color classes which are being used on this site.</p>
    </section>

    <div class="outer grid">
      <div v-for="color in colors" :key="color" class="inner grid">
        <div class="el text">
          <div v-for="n in 5" :key="n" :class="getText(color, n, true)">
            {{ color }}-text lighten-{{ 5 - n + 1 }}-text
          </div>
          <div :class="color + &quot;-text&quot;">{{ color }}-text</div>
          <div v-for="n in 5" :key="n" :class="getText(color, n, false)">
            {{ color }}-text darken-{{ n }}-text
          </div>
        </div>
        <div class="el color">
          <div v-for="n in 5" :key="n" :class="getColor(color, n, true)">
            {{ color }} lighten-{{ 5 - n + 1 }}
          </div>
          <div :class="color">{{ color }}</div>
          <div v-for="n in 5" :key="n" :class="getColor(color, n, false)">
            {{ color }} darken-{{ n }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data: () => ({
    colors: [
      "grey",
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue",
      "purple"
    ]
  }),
  methods: {
    getColor(color, i, lighten) {
      return `${color} ${
        lighten ? "grey-text darken-5-text lighten" : "darken"
      }-${lighten ? 5 - i + 1 : i}`;
    },
    getText(color, i, lighten) {
      return `${color}-text ${lighten ? "lighten" : "darken"}-${
        lighten ? 5 - i + 1 : i
      }-text`;
    }
  }
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
}

.el {
  div {
    height: 80px;
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  &.color {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
  }
  &.text {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
  }
}

.outer.grid {
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: 1em;

  .inner.grid {
    margin: 1em;
    grid-column-end: span 1;
    grid-row-end: span 1;
  }
}
</style>
