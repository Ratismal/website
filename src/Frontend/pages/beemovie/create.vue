<template>
  <main>
    <section>
      <h1>Script Transcriber</h1>
    </section>
    <section>
      <div class="catgrid gap">
        <div ref="lineWrapper" class="col s12 m4 line-wrapper">
          <div v-for="row in currentRows" :key="row.i" :class="{line: true, catflex: true, vertical: true, selected: row === currentRow}" @click.prevent="selectRow(row)">
            <div class="id">Row #{{ row.i }}</div>
            <div class="actor">{{ row.type == 3 ? 'ACTION' : row.type == 2 ? 'TECHNICAL' : row.type == 1 ? 'SYSTEM' : row.actor }}</div>
            <div class="content">{{ row.content }}</div>
          </div>
        </div>

        <div class="col s12 m8">
          <div class="catgrid gap">
            <div class="col s12">
              <span>Row #{{ currentRow.i }}</span>
            </div>
            <div class="col s12 m6 catflex vertical">
              <label>Actor Name</label>
              <input v-model="currentRow.actor" :disabled="currentRow.system">
            </div>
            <div class="col s12 m6 catflex vertical vert-align">
              <div>
                <label>System</label>
                <input v-model="currentRow.type" value="1" type="radio">
              </div>
              <div>
                <label>Technical</label>
                <input v-model="currentRow.type" value="2" type="radio">
              </div>
              <div>
                <label>Action</label>
                <input v-model="currentRow.type" value="3" type="radio">
              </div>
            </div>
            <div class="col s12 catflex vertical">
              <label>Content</label>
              <textarea v-model="currentRow.content" rows="10"/>
            </div>
            <div class="col s12 catflex vertical">
              <button class="button full" @click.prevent="addLine">New Line</button>
              <button class="button full" @click.prevent="save">Save</button>
            </div>
            <div class="col s12">
              <textarea ref="exportText" v-model="exportText" class="export" rows="10" readonly @click.prevent="copy"/>
            </div>
          </div>
        </div>
    </div></section>
  </main>
</template>

<script>
export default {
    data() {
        return {
            rows: [{}],
            i: 0,
            currentIndex: 0,
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
                    desc: 'aaa'
                }
            },
            exportText: ''
        };
    },
    computed: {
        currentRows: {
            get() {
                return this.rows.slice(Math.max(this.currentIndex - 100, 0), Math.min(this.currentIndex + 100, this.rows.length));
            }
        },
        currentRow: {
            get() {
                return this.rows[this.currentIndex];
            }
        }
    },
    mounted() {
        if (process.client) {
            try {
                this.rows = JSON.parse(localStorage.getItem('script-rows'));
                if (!this.rows) this.rows = [{
                    i: 0,
                    content: '',
                    actor: '',
                    type: 0
                }];
                else {
                    let i = 0;
                    this.rows.forEach(r => {
                        r.i = i++;
                        if (r.system) {
                            r.type = 1;
                            r.system = undefined;
                        }
                    });
                    this.i = this.rows.length - 1;
                }

                this.save();
            } catch (err) { }

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
                this.actorInput = 'SYSTEM';
            }
            this.rows.push({
                i: ++this.i,
                content: '',
                actor: '',
                type: 0
            });
            this.currentIndex = this.rows.length - 1;
            this.temp.content = '';
            this.temp.actor = '';
            this.temp.system = false;
            this.$root.$emit("toast", 'Added a new line', 2000);

            setTimeout(() => {
                let el = this.$refs.lineWrapper;
                el.scrollTop = el.scrollHeight;
            }, 100);
        },
        removeLine() {

        },
        selectRow(row) {
            let index = this.rows.indexOf(row);
            if (typeof index === 'number')
                this.currentIndex = index;
        },
        save() {
            const text = JSON.stringify(this.rows.map(r => {
                return {
                    ...r,
                    i: undefined
                };
            }));
            this.exportText = text;
            localStorage.setItem('script-rows', text);
            this.$root.$emit("toast", 'Saved', 2000);
        },
        copy() {
            this.$refs.exportText.select();
            // document.execCommand('copy');
            // this.$root.$emit("toast", 'Copied JSON to clipboard', 2000);
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
}

.export {
    max-height: 100px !important;
}

textarea {
    min-height: 0;
    resize: none;
}
</style>
