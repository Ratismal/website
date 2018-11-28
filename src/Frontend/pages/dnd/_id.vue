<template>
  <main>
    <section>
      <div class="character-wrapper">
        <div class="avatar">
          <img :src="data.icon || '/img/bd/a2018/black.png'" alt="portrait">
          <div class="stats-wrapper">
            <span class="key">Strength:</span>
            <span class="value">{{ getStat('Strength') }}</span>
            <span class="key">Dexterity:</span>
            <span class="value">{{ getStat('Dexterity') }}</span>
            <span class="key">Constitution:</span>
            <span class="value">{{ getStat('Constitution') }}</span>
            <span class="key">Intelligence:</span>
            <span class="value">{{ getStat('Intelligence') }}</span>
            <span class="key">Wisdom:</span>
            <span class="value">{{ getStat('Wisdom') }}</span>
            <span class="key">Charisma:</span>
            <span class="value">{{ getStat('Charisma') }}</span>
          </div>
        </div>
        <div class="content">
          <h1>{{ data.name }}</h1>

          <div class="button-group">
            <nuxt-link to="story" class="center flex-1">Story</nuxt-link>
            <nuxt-link to="info" class="center flex-1">Info</nuxt-link>
            <nuxt-link to="notes" class="center flex-1">Notes</nuxt-link>
            <nuxt-link to="edit" class="center flex-1">Edit</nuxt-link>
          </div>

          <nuxt-child :data="data" :obtained="obtained"/>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Markdown from "~/components/Markdown.vue";

export default {
  components: {
    Markdown
  },
  async asyncData({ params, $axios }) {
    try {
      const body = await $axios.$get("/dnd/character/" + params.id);
      return { data: body, obtained: true };
    } catch (err) {
      return {
        data: {
          name: "",
          age: 0,
          male: null,
          alignment: "",
          race: "",
          class: [],
          ideals: "",
          bonds: "",
          flaws: "",
          customAttributes: {},
          statStrength: [0],
          statDexterity: [0],
          statConstitution: [0],
          statIntelligence: [0],
          statWisdom: [0],
          statCharisma: [0],
          icon: "",
          story: "",
          notes: ""
        },
        obtained: false
      };
    }
  },
  mounted() {
    if (localStorage.token && !this.$cookies.get("token")) {
      this.$cookies.set("token", localStorage.token, { maxAge: 99999999999 });
    }
  },
  methods: {
    getStat(statKey) {
      let stat = this.data["stat" + statKey];
      if (!Array.isArray(stat)) stat = [stat];

      let total = stat.reduce((v, c) => v + c, 0);
      let modifier = Math.floor(total / 2 - 5);
      return `${stat.join("+")} (${modifier >= 0 ? "+" : "-"}${Math.abs(
        modifier
      )})`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/dnd.scss";
</style>
