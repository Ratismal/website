<template>
  <main>
    <section>
      <div class="character-wrapper">
        <div class="avatar">
          <img src="/img/dnd/lintel/portrait.png" alt="portrait">
          <div class="stats-wrapper">
            <span class="key">Age:</span>
            <span class="value">{{ data.attributes.age }}</span>
            <span class="key">Sex:</span>
            <span class="value">{{ data.attributes.male ? 'Male' : 'Female' }}</span>
            <span class="key">Alignment:</span>
            <span class="value">{{ data.attributes.alignment }}</span>
            <span class="key">Class:</span>
            <span class="value">{{ data.attributes.class.join('-') }}</span>
            <span class="key">Ideals:</span>
            <span class="value">{{ data.attributes.ideals }}</span>
            <span class="key">Bonds:</span>
            <span class="value">{{ data.attributes.bonds }}</span>
            <span class="key">Flaws:</span>
            <span class="value">{{ data.attributes.flaws }}</span>
            <template v-for="(cAttr, key) in data.customAttributes">
              <span :key="key" class="key">{{ key }}:</span>
              <span :key="cAttr" class="value">{{ cAttr }}</span>
            </template>
            <span class="key">Strength:</span>
            <span class="value">{{ getStat('strength') }}</span>
            <span class="key">Dexterity:</span>
            <span class="value">{{ getStat('dexterity') }}</span>
            <span class="key">Constitution:</span>
            <span class="value">{{ getStat('constitution') }}</span>
            <span class="key">Intelligence:</span>
            <span class="value">{{ getStat('intelligence') }}</span>
            <span class="key">Wisdom:</span>
            <span class="value">{{ getStat('wisdom') }}</span>
            <span class="key">Charisma:</span>
            <span class="value">{{ getStat('charisma') }}</span>
          </div>
        </div>
        <div class="content">
          <h1>{{ data.attributes.name }}</h1>
          <markdown> <!-- eslint-disable vue/html-indent -->
Lintel was never the pick of the clutch. Always a bit of a runt,
he was batted around by the others. Being constantly assigned to menial tasks,
such as tending to eggs, earned him the nickname "Eggsitter".
Lintel was the constant subject of teasing and humiliation.

But none of that mattered, for Lintel had a dream.

He would become a mighty adventurer, and bring pride and admiration to his clan!

So, he trained in secret. Despite his small stature, he could find his way around a sword.
Sure, he wasn't very strong, but his nimbleness and dexterity made up for it.

And then one night, unbeknownst to anyone, he slipped away with nothing but
the thought of glory in his mind.

Lintel's adventure was about to begin!
          </markdown> <!-- eslint-enable vue/html-indent -->

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
  data() {
    return {
      data: {
        attributes: {
          name: 'Cytchenrok "Eggsitter" Lintel',
          age: 11,
          male: true,
          alignment: "Chaotic Good",
          class: ["Fighter"],
          ideals: "Protect the weak, in the name of justice!",
          bonds: "The Cytchenrock Clan",
          flaws: "Rash, impulsive"
        },
        customAttributes: {
          Color: "Green (poison)"
        },
        stats: {
          strength: [8, 2],
          dexterity: [16],
          constitution: [10],
          intelligence: [13],
          wisdom: [10],
          charisma: [14, 1]
        }
      }
    };
  },
  methods: {
    getStat(statKey) {
      let stat = this.data.stats[statKey];
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
.character-wrapper {
  display: flex;

  .avatar {
    flex: 0 1 auto;
    flex-basis: 0;

    img {
      height: 320px;
    }
  }

  .content {
    flex: 1 0 auto;
    margin: 0 2rem;
    flex-basis: 0;
  }
}

.stats-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  margin: 1rem;

  .key {
    text-align: right;
  }
}
</style>
