<template>
  <main>
    <section>
      <h1>TonyML
        <span class="subtitle">
          a utility to generate tony-styled data dictionaries
        </span>
      </h1>
    </section>

    <section>
      <div class="catgrid gap">
        <div class="col s12 m6 catflex vertical">
          <span>Load Workspace</span>
          <select v-model="tempWorkspace">
            <option v-for="(ws, title) in stored.data" :key="title">{{ title }}</option>
          </select>
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Load Table</span>
          <select v-model="newTitle" @change="load">
            <option v-for="(table, title) in stored.data[tempWorkspace]" :key="title">{{ title }}</option>
          </select>
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>New Workspace</span>
          <input v-model="newWorkspace" class="col s12 m6" type="text">
        </div>
        <button class="col s12 m6 button no-margin" @click="addWorkspace">Add Workspace</button>
        <button class="col s12 m6 button no-margin" @click="newTable">New Table</button>
        <button class="col s12 m6 button no-margin" @click="removeTable">Remove Table</button>
      </div>
      <hr>
      <div class="catgrid gap">
        <div class="col s12 m6 catflex vertical">
          <span>Table Name</span>
          <input v-model="title" type="text">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Current Row</span>
          <select v-model="currentIndex" >
            <option v-for="row in rows" :key="row._id" :value="rows.indexOf(row)">
              {{ row.name }}
            </option>
          </select>
        </div>
      </div>
      <br>
      <div v-if="rows[currentIndex]" class="catgrid gap">
        <div class="col s12 m6 catflex vertical">
          <span>Field Name</span>
          <input ref="fieldName" v-model="rows[currentIndex].name">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Field Type</span>
          <input v-model="rows[currentIndex].type">
        </div>

        <div class="col s4 catflex vertical">
          <span>Primary Key</span>
          <input v-model="rows[currentIndex].pk" type="checkbox">
        </div>
        <div class="col s4 catflex vertical">
          <span>Foreign Key Key</span>
          <input v-model="rows[currentIndex].fk" type="checkbox">
        </div>
        <div class="col s4 catflex vertical">
          <span>Nullable</span>
          <input v-model="rows[currentIndex].nullable" type="checkbox">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Size</span>
          <input v-model="rows[currentIndex].traits.size">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>References</span>
          <input v-model="rows[currentIndex].traits.references">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Identity Start</span>
          <input v-model="rows[currentIndex].traits.start">
        </div>

        <div class="col s12 m6 catflex vertical">
          <span>Identity Increment</span>
          <input v-model="rows[currentIndex].traits.increment">
        </div>

        <div class="col s12 catflex vertical">
          <span>Additional Constraints</span>
          <input v-model="rows[currentIndex].traits.additional">
        </div>
      </div>
      <div v-else>
        there's nothing here, try adding a new row ok
      </div>
      <br>
      <div class="catgrid gap">
        <button class="col s12 m6 button no-margin" @click.prevent="newField">New Field</button>
        <button class="col s12 m6 button no-margin" @click.prevent="removeCurrent">Remove Current</button>
      </div>
    </section>
    <br>
    <section>
      <div ref="tonytable" class="tonytable-wrapper">
        <table border="0" style="border-collapse: collapse; width: 100%">
          <thead>
            <tr>
              <th colspan="2" style="border: 1px solid black">{{ title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row._id">
              <td :style="cellStyle(row, 1)">{{ row.pk ? '&lt;&lt;PK&gt;&gt;' : '' }}{{ row.fk ? '&lt;&lt;FK&gt;&gt;' : '' }}</td>
              <td :style="cellStyle(row, 2)">{{ serialize(row) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="field-group">
        <button class="button full" @click.prevent="copyTable">Copy</button>
      </div>
    </section>

    <section>
      <h2>hotkeys</h2>
      <div v-for="(hotkey, key) in hotkeys" :key="key">
        <code>CTRL+{{ key }}</code>: <span>{{ hotkey.desc }}</span>
      </div>
    </section>

    <section>
      <h2>JSON</h2>
      <h3>Export</h3>
      <textarea v-model="jsonStored" readonly/>
      <h3>Import</h3>
      <textarea v-model="toImport"/>
      <button class="button full" @click.prevent="importJson">Import</button>
    </section>
    <br>
  </main>
</template>

<script>
export default {
  data() {
    return {
      rows: [
        {
          _id: 0,
          pk: true,
          fk: false,
          name: "FieldID",
          type: "Number",
          nullable: false,
          traits: {
            size: null,
            order: null,
            references: null,
            additional: null,
            start: null,
            increment: null
          }
        }
      ],
      workspace: "default",
      newWorkspace: "",
      tempWorkspace: "default",
      title: "Cool Table",
      newTitle: "",
      currentIndex: 0,
      toImport: "",
      stored: {
        data: {},
        version: 2
      },
      hotkeys: {
        s: {
          func: () => {
            this.save();
          },
          desc: "Saves the table."
        },
        n: {
          func: () => {
            this.newField();
          },
          desc: "Adds a new field to the table."
        },
        N: {
          func: () => {
            this.newTable();
          },
          desc: "Creates a new table."
        },
        r: {
          func: () => {
            this.removeCurrent();
          },
          desc: "Removes the current field."
        },
        k: {
          func: () => {
            if (this.current) this.current.pk = !this.current.pk;
          },
          desc: "Toggles primary key for the current field."
        },
        K: {
          func: () => {
            if (this.current) this.current.fk = !this.current.fk;
          },
          desc: "Toggles foreign key for the current field."
        },
        m: {
          func: () => {
            if (this.current) this.current.nullable = !this.current.nullable;
          },
          desc: "Toggles nullable for the current field."
        },
        ArrowUp: {
          func: e => {
            if (e.shiftKey) {
              this.currentIndex--;
              if (this.currentIndex < 0) this.currentIndex = 0;
            } else {
              if (this.currentIndex > 0) {
                let [el] = this.rows.splice(this.currentIndex, 1);
                this.rows.splice(this.currentIndex - 1, 0, el);
                this.currentIndex--;
              }
            }
          },
          desc: "Moves the current field up."
        },
        ArrowDown: {
          func: e => {
            if (e.shiftKey) {
              this.currentIndex++;
              if (this.currentIndex > this.rows.length - 1)
                this.currentIndex = this.rows.length - 1;
            } else {
              if (this.currentIndex < this.rows.length - 1) {
                let [el] = this.rows.splice(this.currentIndex, 1);
                this.rows.splice(this.currentIndex + 1, 0, el);
                this.currentIndex++;
              }
            }
          },
          desc: "Moves the current field down."
        }
      }
    };
  },
  computed: {
    tables() {
      try {
        return Object.keys(this.stored.data[this.tempWorkspace]);
      } catch (err) {
        return [];
      }
    },
    workspaces() {
      try {
        return Object.keys(this.stored.data);
      } catch (err) {
        return [];
      }
    },
    current() {
      return this.rows[this.currentIndex];
    },
    currentPk() {
      return this.rows[this.currentIndex].pk;
    },
    jsonStored() {
      return JSON.stringify(this.stored);
    }
  },
  watch: {
    currentPk() {
      this.calculateOrders();
    }
  },
  mounted() {
    let stored;
    try {
      stored = JSON.parse(localStorage.getItem("stored"));
      if (typeof stored !== "object") {
        // NO-OP
      } else if (!stored.version) {
        let oldStored = stored;
        stored = {
          version: 2,
          data: {
            default: {}
          }
        };
        for (const key in oldStored) {
          stored.data.default[key] = { rows: oldStored[key] };
        }
      } else if (stored.version === 2) {
        // NO-OP
      }
    } catch (err) {}
    if (!stored) {
      stored = {
        version: 2,
        data: {
          default: {
            "Cool Table": {
              rows: []
            }
          }
        }
      };
    }
    this.stored = stored;
    console.log(this.stored);

    document.addEventListener("keydown", e => {
      if (e.ctrlKey) {
        if (this.handleKeypress(e)) {
          // console.log("Preventing default.");
          e.preventDefault();
        }
      }
    });
  },
  methods: {
    addToast(text, time = 5000) {
      this.$root.$emit("toast", text, time);
    },
    importJson() {
      let toImport = JSON.parse(this.toImport);
      if (!toImport) return;
      switch (toImport.version) {
        case 2: {
          for (const wkey in toImport.data) {
            if (!this.stored.data[wkey]) this.stored.data[wkey] = {};
            const workspace = toImport.data[wkey];
            for (const tkey in workspace) {
              this.stored.data[wkey][tkey] = workspace[tkey];
            }
          }
          break;
        }
      }
    },
    newTable() {
      this.title = "Cool Table";
      this.rows = [];
      this.newField();
    },
    removeTable() {
      console.log(this.title, this.stored.data);
      delete this.stored.data[this.workspace][this.title];
      this.newTable();
    },
    addWorkspace() {
      this.stored.data[this.newWorkspace] = {};
      this.newWorkspace = "";
      this.save();
    },
    newField() {
      this.rows.push({
        _id: Date.now(),
        pk: false,
        fk: false,
        name: "NewField",
        type: "Number",
        nullable: true,
        traits: {
          size: null,
          order: null,
          references: null,
          additional: null,
          start: null,
          increment: null
        }
      });
      this.currentIndex = this.rows.length - 1;
      setTimeout(() => {
        this.$refs.fieldName.focus();
        this.$refs.fieldName.select();
      }, 100);
    },
    removeCurrent() {
      let el = this.rows[this.currentIndex];
      if (el) {
        this.rows.splice(this.currentIndex, 1);
        this.currentIndex = Math.min(
          Math.max(this.currentIndex - 1, 0, this.rows.length - 1)
        );
      }
    },
    serialize(row) {
      let add = Object.keys(row.traits)
        .filter(t => !!row.traits[t])
        .map(t => {
          let val = row.traits[t];
          if (t === "additional") return val;
          else if (t === "order") return `key=PK, ${t}=${val}`;
          else return `${t}=${val}`;
        });
      return `${row.name}:${row.type}${row.nullable ? "[0..1]" : ""} ${
        add.length > 0 ? `{${add.join(", ")}}` : ""
      }`;
    },
    cellStyle(row, cell) {
      let style = {
        borderLeft: cell === 1 ? "1px solid black" : "none",
        borderRight: cell === 2 ? "1px solid black" : "none",
        borderTop: "none",
        borderBottom:
          this.rows.indexOf(row) === this.rows.length - 1
            ? "1px solid black"
            : "none",
        textAlign: cell === 1 ? "center" : "left"
      };
      return style;
    },
    copyTable() {
      let el = this.$refs.tonytable;
      // this.selectElement(el);
      function listener(e) {
        e.clipboardData.setData("text/html", el.innerHTML);
        e.clipboardData.setData("text/plain", el.innerHTML);
        e.preventDefault();
      }
      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);
      // document.execCommand("copy");
    },
    selectElement(el) {
      var body = document.body,
        range,
        sel;
      if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
          range.selectNodeContents(el);
          sel.addRange(range);
        } catch (e) {
          range.selectNode(el);
          sel.addRange(range);
        }
      } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
      }
    },
    save() {
      this.addToast("Saved...");
      console.log("Saving...");
      this.stored.data[this.tempWorkspace][this.title] = { rows: this.rows };
      localStorage.setItem("stored", JSON.stringify(this.stored));
      // this.load();
    },
    load() {
      this.workspace = this.tempWorkspace;
      this.currentIndex = 0;
      let table = this.stored.data[this.workspace][this.newTitle];
      this.rows = table ? table.rows : [];
      this.title = this.newTitle;
      this.newTitle = "";
    },
    handleKeypress(e) {
      let el = this.rows[this.currentIndex];

      console.log(e.key);

      if (this.hotkeys[e.key]) {
        this.hotkeys[e.key].func(e);
        return true;
      }
      // console.log('Was not handled');
      return false;
    },
    calculateOrders() {
      this.rows.forEach(c => {
        if (!c.pk) c.traits.order = null;
      });
      let rows = this.rows.filter(c => c.pk);
      if (rows.length === 1) {
        rows[0].traits.order = null;
      } else if (rows.length >= 1) {
        rows.forEach((row, i) => {
          row.traits.order = i + 1;
        });
      }
    }
  },
  head: {
    title: "TonyML Generator",
    link: [{ rel: "icon", type: "image/x-icon", href: "/img/tony.png" }]
  }
};
</script>

<style lang="scss" scoped>
// table.tonyml {
//   &,
//   td,
//   tr,
//   th {
//     background-color: white;
//     color: black;
//   }

//   th {
//     text-align: center;
//     border: 1px solid black;
//   }

//   td {
//     &:first-child {
//       border-left: 1px solid black;
//       border-right: none;
//     }
//     border-right: 1px solid black;
//     border-left: none;
//     text-align: left;
//   }

//   tr:last-child td {
//     border-bottom: 1px solid black;
//   }

//   border: 1px solid black;
//   border-collapse: collapse;
//   width: 100%;
// }

.tonytable-wrapper {
  padding: 1rem;
  background: white;
  color: black;
}
</style>

