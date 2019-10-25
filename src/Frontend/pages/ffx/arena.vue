<template>
  <main>
    <section>
      <div class="selection-type-wrapper">
        <button
          v-for="type in types"
          :key="type"
          :class="getTypeButtonClass(type)"
          @click.prevent="selectType(type)"
        >{{ type }}</button>
      </div>
      <template v-if="selectedType === 'location'">
        <div class="locations-wrapper">
          <button
            v-for="(obj, key) in data.locations"
            :key="key"
            :class="getAreaButtonClass(obj)"
            @click.prevent="selectArea(obj)"
          >{{ key }}</button>
        </div>
        <div v-if="selectedArea" class="note">{{ selectedArea.note }}</div>
      </template>
      <template v-else-if="selectedType === 'special conquest'">
        <div class="locations-wrapper">
          <button
            v-for="(obj, key) in data.sConquest"
            :key="key"
            :class="getSCButtonClass(obj)"
            @click.prevent="selectSC(obj)"
          >{{ key }}</button>
        </div>
        <div v-if="selectedSConquest" class="note">Required Kills: {{ selectedSConquest.quantity }}</div>
      </template>

      <div class="monster-wrapper">
        <div v-for="(monster) in filteredMonsters" :key="monster.name" :class="monster.class">
          <div class="monster-name">
            <span class="name">{{ monster.name }}</span>
            <span class="type">{{ monster.type }}</span>
          </div>
          <span class="monster-kills">{{ monster.count }}</span>
          <button class="button" @click.prevent="monster.decrement">-</button>
          <button class="button" @click.prevent="monster.increment">+</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Data from "~/assets/js/ffxarena.js";

export default {
  data() {
    return {
      data: new Data(),
      types: ["location", "special conquest"],
      selectedArea: null,
      selectedSConquest: null,
      selectedType: "location"
    };
  },
  computed: {
    filteredMonsters() {
      if (this.selectedType === "location" && this.selectedArea)
        return this.selectedArea.monsters;
      else if (
        this.selectedType === "special conquest" &&
        this.selectedSConquest
      ) {
        return this.data.types[this.selectedSConquest.type];
      } else return [];
    },
    monsters() {
      return this.data.monsters;
    }
  },
  watch: {
    monsters: {
      deep: true,
      handler() {
        localStorage.setItem("ffxarena", this.data.serialize());
      }
    }
  },
  mounted() {
    if (process.client) {
      if (localStorage.getItem("ffxarena")) {
        this.data.deserialize(localStorage.getItem("ffxarena"));
      }
    }
  },
  methods: {
    selectArea(area) {
      console.log(area);
      this.selectedArea = area;
    },
    getAreaButtonClass(area) {
      let c = area.class;
      return {
        button: true,
        selected: this.selectedArea === area,
        [c]: true
      };
    },
    selectType(type) {
      this.selectedType = type;
    },
    getTypeButtonClass(type) {
      return {
        button: true,
        selected: this.selectedType === type
      };
    },
    selectSC(sc) {
      this.selectedSConquest = sc;
    },
    getSCButtonClass(sc) {
      let c = "c-none";
      let monsters = Object.values(this.data.types[sc.type]);
      let lowest = monsters.reduce((acu, cur) => Math.min(acu, cur.count), 15);
      let half = sc.quantity / 2;
      if (lowest > 0 && lowest <= half) c = "c-low";
      else if (lowest > half && lowest < sc.quantity) c = "c-mid";
      else if (lowest === sc.quantity) c = "c-perfect";

      return {
        button: true,
        selected: this.selectedSConquest === sc,
        [c]: true
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.note {
  margin: 1rem 0;
  white-space: pre-wrap;
}
.monster-wrapper {
  display: flex;
  flex-direction: column;

  .monster {
    box-sizing: border-box;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 50px 50px 50px;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.1);
    margin: 0.5rem 0;
    align-items: center;

    .monster-name {
      display: flex;
      flex-direction: column;
      .name {
      }
      .type {
        font-size: 0.8rem;
        text-transform: uppercase;
      }
    }

    button {
      margin: 0;
    }
  }
}

.selection-type-wrapper {
  display: flex;
  width: 100%;
  button {
    flex: 1 0 auto;
  }
}
.locations-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  button {
    margin: 0;
  }
}
.counter {
  margin: 0.5rem;
  max-width: 200px;
}

.chart {
  width: 100%;
  height: 500px;
}

.selected {
  background: rgba(0, 180, 100, 0.8);
}

$counts: (
  c-low: rgb(80, 20, 20),
  c-mid: rgb(126, 63, 1),
  c-high: rgb(69, 95, 39),
  c-perfect: rgb(8, 94, 28),
  c-none: rgb(76, 68, 80)
);

@each $name, $color in $counts {
  .#{$name} {
    background: $color !important;
  }
  button.#{$name}:hover {
    background: lighten($color, 5) !important;
  }
  button.#{$name}.selected {
    background: lighten($color, 10) !important;
  }
}
</style>
