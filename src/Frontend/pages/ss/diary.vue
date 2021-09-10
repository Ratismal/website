<template>
  <main>
    <section :class="{original, colors}">
      <h1>Sudoku Diary</h1>
      <div class="sudoku-wrapper">
        <div class="sudoku">
          <div v-for="tile in state" :key="tileKey(tile)" :class="tileClass(tile)" class="tile" @click.prevent="selectTile(tile)">
            {{ original ? tile.number : tile.value || '' }}
            <div v-if="tile.locked" class="lock"/>
            <div v-if="tile.question.length > 0" class="question">
              <div v-for="q of tile.question" :key="q" :class="'value value-' + q"/>
            </div>
            <div class="wrong">!</div>
          </div>
        </div>
        <div class="side">
          <template v-if="selectedTile">
            <h2>Selected</h2>
            <div>Coords: {{ selectedTile.x }}, {{ selectedTile.y }}</div>
            <div>Term: {{ getTerm(selectedTile) }}</div>
            <div :class="tileClass(selectedTile)" class="wumbo tile no-border-right no-border-lower">
              {{ original ? selectedTile.number : selectedTile.value || '' }}
              <div v-if="selectedTile.locked" class="lock"/>
              <div v-if="selectedTile.question.length > 0" class="question">
                <div v-for="q of selectedTile.question" :key="q" :class="'value value-' + q"/>
              </div>
            </div>
            <div class="tiles">
              <div v-for="i in 16" :key="i" :class="tileSelectClass(i)" @click.prevent="selectTileColor(i, $event)">
                {{ i }}
              </div>
            </div>
          </template>
          <div class="buttons">
            <button class="button full" @click.prevent="toggleOriginal">View {{ original ? 'Sudoku' : 'Original' }}</button>
            <button class="button full" @click.prevent="resetDiary">Reset</button>
            <button class="button full" @click.prevent="toggleColors">Toggle Colors</button>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>

<script>
import diary from '@/assets/json/diary.json';

const numberMap = [25, 14, 28, 3, 6, 7, 26, 8, 22, 13, 27, 11, 19, 16, 9, 5];
const colorMap = ['gold', 'bronze', 'copper', 'grey', 'green', 'white', 'red', 'black', 'blue', 'iron', 'silver', 'brass', 'gold', 'bronze', 'copper', 'grey' ];
const terms = ['to break', 'door', 'name', 'to accomplish', 'sheep', 'boat', 'tiger', 'to see', 'to approach', 'mountain', 'to open', 'achievement', 'mouth', 'to sink', 'cauldron', 'to drop behind'];

export default {
  data() {
    return {
      baseDiary: diary,
      state: null,
      original: false,
      selectedTile: null,
      relatedTiles: null,
      boundKeyPress: null,
      colors: true
    };
  },
  mounted() {
    if (localStorage.getItem('diaryState')) {
      this.state = JSON.parse(localStorage.getItem('diaryState'));
    } else {
      this.resetDiary();
    }

    this.boundKeyPress = this.onKeyPress.bind(this);
    document.addEventListener('keydown', this.boundKeyPress);
  },
  destroyed() {
    document.removeEventListener('keydown', this.boundKeyPress);
  },
  methods: {
    onKeyPress(e) {
      if (!this.selectedTile) {
        return;
      }
      console.log(e);

      const originalCoords = [this.selectedTile.x, this.selectedTile.y];
      const coords = [...originalCoords];
      if (e.key === 'ArrowDown') {
        coords[1] = Math.min(15, coords[1] + 1);
      } else if (e.key === 'ArrowUp') {
        coords[1] = Math.max(0, coords[1] - 1);
      } else if (e.key === 'ArrowRight') {
        coords[0] = Math.min(15, coords[0] + 1);
      } else if (e.key === 'ArrowLeft') {
        coords[0] = Math.max(0, coords[0] - 1);
      }
      if (coords[0] !== originalCoords[0] || coords[1] !== originalCoords[1]) {
        const tile = this.getTile(...coords);
        if (tile) {
          this.selectTile(tile);
        }

        e.preventDefault();
      }
    },
    selectTileColor(value, event) {
      if (this.selectedTile.locked) return;

      if (event.shiftKey) {
        if (this.selectedTile.question.includes(value)) {
          this.selectedTile.question.splice(this.selectedTile.question.indexOf(value), 1);
        } else {
          this.selectedTile.question.push(value);
        }
        this.selectedTile.value = 0;
        this.selectedTile.color = null;
        this.selectedTile.number = null;
      } else {
        if (this.selectedTile.value === value) {
          this.selectedTile.value = 0;
          this.selectedTile.color = null;
          this.selectedTile.number = null;
        } else {
          this.selectedTile.value = value;
          this.selectedTile.color = colorMap[value - 1];
          this.selectedTile.number = numberMap[value - 1];
        }
        this.selectedTile.question = [];
      }

      this.saveDiary();
    },
    selectTile(tile) {
      this.selectedTile = tile;
      this.relatedTiles = this.getRelatedTiles(tile);
    },
    getTerm(tile) {
      return terms[tile.value];
    },
    toggleOriginal() {
      this.original = !this.original;
    },
    toggleColors() {
      this.colors = !this.colors;
    },
    tileKey(tile) {
      return `${tile.x},${tile.y}`;
    },
    getTile(x, y) {
      return this.state.find(t => t.x === x && t.y === y);
    },
    getTileRow(tile) {
      return this.state.filter(t => t.y === tile.y);
    },
    getTileColumn(tile) {
      return this.state.filter(t => t.x === tile.x);
    },
    getTileGroup(tile) {
      return this.state.filter(t => t.groupX === tile.groupX && t.groupY === tile.groupY);
    },
    getRelatedTiles(tile) {
      return this.state.filter(t =>
        (t.x === tile.x) ||
        (t.y === tile.y) ||
        (t.groupX === tile.groupX && t.groupY === tile.groupY));
    },
    tileSelectClass(i) {
      const tile = this.selectedTile;
      const c = [
        'tile',
        'value-' + i,
        'no-border-right',
        'no-border-lower'
      ];

      if (tile.locked ||
        (this.relatedTiles &&
          this.relatedTiles.find(t => t !== tile && (t.value === i)))) {
        c.push('disabled');
      }

      return c;
    },
    tileClass(tile) {
      const c = {
        locked: tile.locked,
        [`value-${tile.value}`]: true,
        [tile.color]: true,
        selected: this.selectedTile === tile
      };

      if ([3, 7, 11].includes(tile.x)) {
        c['right-border'] = true;
      } else if (tile.x === 15) {
        c['no-border-right'] = true;
      }

      if ([3, 7, 11].includes(tile.y)) {
        c['lower-border'] = true;
      } else if (tile.y === 15) {
        c['no-border-bottom'] = true;
      }

      if (this.relatedTiles && this.relatedTiles.includes(tile)) {
        c.related = true;
      }

      if (tile.value !== 0) {
        const related = this.getRelatedTiles(tile);
        if (related.find(t => t !== tile && (t.value === tile.value || t.question.includes(tile.value)))) {
          c.wrong = true;
        }
      }

      return c;
    },
    resetDiary() {
      const state = [];
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const existing = diary.find(e => e.x === x && e.y === y);
          state.push({
            ...(existing || {
              color: null,
              number: null,
              value: 0
            }),
            question: [],
            locked: !!existing,
            x, y,
            groupX: Math.floor(x / 4),
            groupY: Math.floor(y / 4)
          });
        }
      }

      this.state = state;
    },
    saveDiary() {
      localStorage.setItem('diaryState', JSON.stringify(this.state));
    }
  }
};
</script>

<style lang="scss" scoped>
.sudoku-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.sudoku {
  display: grid;
  grid-template-columns: repeat(16, 41px);
  grid-template-rows: repeat(16, 41px);
}

$base-color: rgb(255, 0, 0);

$tile-types:
  (background: rgb(248, 114, 114), color: black),
  (background: #f0cd65, color: black),
  (background: #f8f79e, color: black),
  (background: #7ff78f, color: black),
  (background: rgb(106, 243, 243), color: black),
  (background: #7598ff, color: black),
  (background: #a75cf1, color: black),
  (background: #f56eee, color: black),
  (background: rgb(199, 7, 7), color: white),
  (background: #aa8106, color: white),
  (background: #a3a12a, color: white),
  (background: #04a71a, color: white),
  (background: rgb(3, 179, 179), color: white),
  (background: #042eb8, color: white),
  (background: #6506c4, color: white),
  (background: #940775, color: white);

.side {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(4, 40px);
  grid-template-rows: repeat(4, 40px);
  justify-content: center;
}

.tile {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: black;
  user-select: none;

  &.wumbo {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }

  &.wrong .wrong {
    display: block;
    position: absolute;
    top: 0;
    left: 2px;
  }

  .wrong {
    display: none;
  }

  // &.value-0 {
  //   background: white;
  //   color: black;
  // }


}

.colors {
  @for $i from 1 through 16 {
    // &.value-#{$i} {
    //   background: adjust-hue($base-color, 360 / 8 * ($i - 1));
    // }
    $type: nth($tile-types, $i);

    .value-#{$i} {
      background: map-get($type, 'background');
      color: map-get($type, 'color');

      &.disabled {
        background: desaturate(map-get($type, 'background'), 99);

      }
    }
  }
}

section .tile {
  border-right: 1px solid rgb(212, 212, 212);
  border-bottom: 1px solid rgb(212, 212, 212);

  &.right-border {
    border-right: 1px solid black;
  }
  &.lower-border {
    border-bottom: 1px solid black;
  }

  &.no-border-right {
    border-right: none;
  }
  &.no-border-lower {
    border-bottom: none;
  }

  .question {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap-reverse;
    height: 40px;
    width: 40px;
    align-items: flex-end;
    align-content: flex-start;

    .value {
      height: 10px;
      width: 10px;
    }
  }

  .lock {
    // box-shadow: inset 0px 0px 5px rgb(77, 1, 1);
    opacity: 1;
    position: absolute;
    background: black;
    width: 5px;
    height: 5px;
    bottom: 0;
    left: 0;
  }

  &.wumbo {
    .lock {
      height: 10px;
      width: 10px;
    }
  }

  &.locked {
    user-select: none;
  }

  &.related {
    opacity: 0.9;
  }

  &.selected {
    box-shadow: inset 0 0 0px 3px black;
  }

  &:not(.locked) {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
}

.original.colors .tile {
  &.gold {
    background: gold;
  }
  &.bronze {
    background: #B17F4D;
  }
  &.copper {
    background: rgb(221, 135, 7);
  }
  &.grey {
    background: rgb(190, 190, 190);
  }
  &.green {
    background: rgb(85, 231, 85);
  }
  &.white {
    background: rgb(245, 245, 245);
  }
  &.red {
    background: rgb(255, 130, 130);
  }
  &.black {
    background: rgb(0, 0, 0);
    color: white;
  }
  &.blue {
    background: rgb(104, 104, 255);
  }
  &.iron {
    background: rgb(141, 141, 141);
  }
  &.silver {
    background: rgb(183, 191, 206);
  }
  &.brass {
    background: #DEBA6C;
  }
}

.buttons .button {
  margin: 0.5rem 0;
}
</style>
