<template>
  <main>
    <section>
      <h1>Script Transcriber</h1>
    </section>
    <div class="catgrid gap">
      <div ref="lineWrapper" class="col s12 m3 line-wrapper">
        <div v-for="row in currentRows" :key="row.i" :class="{line: true, catflex: true, vertical: true, selected: row === currentRow}" @click.prevent="selectRow(row)">
          <div class="id">Row #{{ row.i }}</div>
          <div class="actor">{{ !row.type ? row.actor : types[row.type] }}</div>
          <div class="content">{{ row.content }}</div>
        </div>
      </div>

      <div class="col s12 m5 editor-wrapper">
        <div class="catgrid gap">
          <div class="col s12">
            <span>Row #{{ currentRow.i }}</span>
          </div>
          <div class="col s12 m6 catflex vertical">
            <label>Actor Name</label>
            <input v-model="currentRow.actor" :disabled="currentRow.system">
          </div>
          <div class="col s12 m6 catflex vertical">
            <label>Actor Type</label>
            <select v-model="currentRow.type" class="full">
              <option v-for="(t, i) in types" :key="i" :value="i">
                {{ t }}
              </option>
            </select>
          </div>
          <div class="col s12 catflex vertical">
            <label>Content</label>
            <textarea ref="contentInput" v-model="currentRow.content" rows="10"/>
          </div>
          <div class="col s12 catflex vertical">
            <div class="catflex horizontal">
              <button class="button grow" @click.prevent="addLine">New Line</button>
              <button class="button danger grow" @click.prevent="removeLine">Remove Line</button>
            </div>
            <button class="button full" @click.prevent="save">Save</button>
          </div>
          <div class="col s12">
            <textarea ref="exportText" v-model="exportText" class="export" rows="10" readonly @click.prevent="copy"/>
          </div>
        </div>
      </div>

      <div class="col s12 m4 catflex vertical">
        <div class="script">
          <span v-for="(line, i) in currentScript" :key="i" @click.prevent="copyText">{{ line }}</span>
        </div>
        <div class="catflex horizontal">
          <button class="button grow" @click.prevent="changePage(false)">Prev</button>
          <input v-model="scriptPage" class="pager" type="number">
          <button class="button grow" @click.prevent="changePage(true)">Next</button>
        </div>
        <div class="catflex horizontal around">
          <div class="catflex vertical">
            <label>Lines per Page</label>
            <input v-model="linesPerPage" type="number" class="pager">
          </div>
          <div class="catflex vertical">
            <label>Total Pages</label>
            <input v-model="scriptPages" type="number" class="pager" readonly>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import beemovie from "~/assets/json/beemovie.json";

export default {
  data() {
    return {
      rows: [{}],
      i: 0,
      currentIndex: 0,
      types: ["NORMAL", "SYSTEM", "TECHNICAL", "ACTION"],
      beemovie,
      scriptPage: 0,
      linesPerPage: 12,
      hotkeys: {
        s: {
          func: () => {
            this.save();
          },
          desc: "Saves the table."
        },
        n: {
          func: () => {
            this.addLine();
          },
          desc: "Adds a new field to the table."
        },
        t: {
          func: () => {
            this.currentRow.type = (this.currentRow.type + 1) % 4;
          },
          desc: "aaa"
        }
      },
      exportText: ""
    };
  },
  computed: {
    currentRows: {
      get() {
        return this.rows.slice(
          Math.max(this.currentIndex - 100, 0),
          Math.min(this.currentIndex + 100, this.rows.length)
        );
      }
    },
    currentRow: {
      get() {
        if (this.rows[this.currentIndex]) return this.rows[this.currentIndex];
        else
          return {
            i: 0,
            content: "Something is wrong. There's nothing here.",
            actor: "Uh Oh",
            type: 0
          };
      }
    },
    currentScript: {
      get() {
        return this.beemovie.slice(
          this.scriptPage * this.linesPerPage,
          this.scriptPage * this.linesPerPage + this.linesPerPage
        );
      }
    },
    scriptPages: {
      get() {
        return Math.ceil(this.beemovie.length / this.linesPerPage);
      }
    }
  },
  watch: {
    scriptPage(value) {
      localStorage.setItem("script-page", value);
    },
    linesPerPage(value) {
      localStorage.setItem("script-lpp", value);
    }
  },
  mounted() {
    if (process.client) {
      try {
        this.rows = JSON.parse(localStorage.getItem("script-rows"));
        if (!this.rows)
          this.rows = [
            {
              i: 0,
              content: "",
              actor: "",
              type: 0
            }
          ];
        else {
          let i = 0;
          this.rows.forEach(r => {
            r.i = i++;
            if (r.system !== undefined) {
              r.type = r.system ? 1 : 0;
              r.system = undefined;
            }
          });
          this.i = this.rows.length - 1;
        }

        if (localStorage.getItem("script-page"))
          this.scriptPage = parseInt(localStorage.getItem("script-page")) || 0;
        if (localStorage.getItem("script-lpp"))
          this.linesPerPage = parseInt(localStorage.getItem("script-lpp")) || 0;

        this.save();
      } catch (err) {}

      document.addEventListener("keydown", e => {
        if (e.ctrlKey) {
          if (this.handleKeypress(e)) {
            // console.log("Preventing default.");
            e.preventDefault();
          }
        }
      });
    }
  },

  methods: {
    changePage(next = true) {
      this.scriptPage = Math.max(
        0,
        Math.min(this.beemovie.length - 1, this.scriptPage + (next ? 1 : -1))
      );
    },
    handleKeypress(e) {
      if (this.hotkeys[e.key]) {
        this.hotkeys[e.key].func(e);
        return true;
      }
      // console.log('Was not handled');
      return false;
    },
    addLine() {
      if (this.system) {
        this.actorInput = "SYSTEM";
      }
      const row = {
        i: ++this.i,
        content: "",
        actor: "",
        type: 0
      };
      this.rows.splice(this.currentIndex + 1, 0, row);
      this.currentIndex++;
      this.$root.$emit("toast", "Added a new line", 2000);

      //   setTimeout(() => {
      //     let el = this.$refs.lineWrapper;
      //     el.scrollTop = el.scrollHeight;
      //   }, 100);
    },
    removeLine() {
      this.rows.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.rows.length)
        this.currentIndex = this.rows.length - 1;
      this.$root.$emit("toast", "Removed a new line", 2000);
    },
    selectRow(row) {
      let index = this.rows.indexOf(row);
      if (typeof index === "number") this.currentIndex = index;
    },
    save() {
      const text = JSON.stringify(
        this.rows.map(r => {
          return {
            ...r,
            i: undefined
          };
        })
      );
      this.exportText = text;
      localStorage.setItem("script-rows", text);
      this.$root.$emit("toast", "Saved", 2000);
    },
    copy() {
      this.$refs.exportText.select();
      // document.execCommand('copy');
      // this.$root.$emit("toast", 'Copied JSON to clipboard', 2000);
    },
    copyText(event) {
      console.log(event);
      let text = event.target.innerText;
      if (event.ctrlKey) {
        this.currentRow.actor = text;
      } else this.currentRow.content += text + " ";
      this.$refs.contentInput.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.line-wrapper {
  overflow-x: auto;
  max-height: 600px;
}

.line {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;

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

.script {
  white-space: pre-wrap;

  span {
    display: block;
    margin: 0.5rem 0;
    padding: 0;
    transition-duration: 0.1s;
    &:hover {
      color: rgb(87, 241, 195);
    }
  }
}

.export {
  max-height: 100px !important;
}

textarea {
  min-height: 0;
  resize: none;
}

.editor-wrapper {
  padding: 1rem;
}

.pager {
  flex: 0 0 auto;
  max-width: 100px;
  display: block;
}
</style>
