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
      <div class="input-field">
        <span>Table Name</span>
        <input v-model="title" type="text">
      </div>
      <div class="input-field">
        <span>Load Table</span>
        <div class="field-group">
          <select v-model="newTitle">
            <option v-for="title in tables" :key="title">{{ title }}</option>
          </select>
          <button class="button flex no-margin" @click.prevent="load">Load</button>

        </div>
      </div>
      <hr>
      <div class="input-field">
        <span>Current Row</span>
        <select v-model="currentIndex" >
          <option v-for="row in rows" :key="row._id" :value="rows.indexOf(row)">
            {{ row.name }}
          </option>
        </select>
      </div>
      <div v-if="rows[currentIndex]">
        <div class="field-group">
          <div class="input-field">
            <span>Field Name</span>
            <input v-model="rows[currentIndex].name">
          </div>
          <div class="input-field">
            <span>Field Type</span>
            <input v-model="rows[currentIndex].type">
          </div>
        </div>
        <div class="field-group">
          <div class="input-field">
            <span>Primary Key</span>
            <input v-model="rows[currentIndex].pk" type="checkbox">
          </div>
          <div class="input-field">
            <span>Foreign Key Key</span>
            <input v-model="rows[currentIndex].fk" type="checkbox">
          </div>
          <div class="input-field">
            <span>Nullable</span>
            <input v-model="rows[currentIndex].nullable" type="checkbox">
          </div>
        </div>
        <div class="field-group">
          <div class="input-field">
            <span>Size</span>
            <input v-model="rows[currentIndex].traits.size">
          </div>
          <div class="input-field">
            <span>Order</span>
            <input v-model="rows[currentIndex].traits.order">
          </div>
          <div class="input-field">
            <span>References</span>
            <input v-model="rows[currentIndex].traits.references">
          </div>
        </div>
        <div class="field-group">
          <div class="input-field">
            <span>Identity Start</span>
            <input v-model="rows[currentIndex].traits.start">
          </div>
          <div class="input-field">
            <span>Identity Increment</span>
            <input v-model="rows[currentIndex].traits.increment">
          </div>
        </div>
        <div class="input-field">
          <span>Additional Constraints</span>
          <input v-model="rows[currentIndex].traits.additional">
        </div>
      </div>
      <div v-else>
        there's nothing here, try adding a new row ok
      </div>
      <div class="field-group">
        <button class="button flex" @click.prevent="newField">New Field</button>
        <button class="button flex" @click.prevent="removeCurrent">Remove Current</button>
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
      title: "Cool Table",
      newTitle: "",
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
            this.newField();
          },
          desc: "Adds a new field to the table."
        },
        N: {
          func: () => {
            this.title = "Cool Table";
            this.rows = [];
            this.newField();
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
        v: {
          func: () => {
            this.currentIndex--;
            if (this.currentIndex < 0) this.currentIndex = 0;
          },
          desc: "Moves to the previous field."
        },
        b: {
          func: () => {
            this.currentIndex++;
            if (this.currentIndex > this.rows.length - 1)
              this.currentIndex = this.rows.length - 1;
          },
          desc: "Moves to the next field."
        }
      }
    };
  },
  computed: {
    tables() {
      try {
        return Object.keys(JSON.parse(localStorage.getItem("stored")));
      } catch (err) {
        return [];
      }
    },
    current() {
      return this.rows[this.currentIndex];
    }
  },
  mounted() {
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
      console.log("Saving...");
      let store;
      try {
        store = JSON.parse(localStorage.getItem("stored"));
      } catch (err) {}
      if (!store) {
        localStorage.setItem("stored", "{}");
        store = {};
      }
      store[this.title] = this.rows;
      localStorage.setItem("stored", JSON.stringify(store));
    },
    load() {
      let store;
      try {
        store = JSON.parse(localStorage.getItem("stored"));
      } catch (err) {}
      if (!store) {
        localStorage.setItem("stored", "{}");
        store = {};
      }
      let rows = store[this.newTitle];
      this.rows = rows || [];
      this.title = this.newTitle;
      this.newTitle = "";
    },
    handleKeypress(e) {
      let el = this.rows[this.currentIndex];

      if (this.hotkeys[e.key]) {
        this.hotkeys[e.key].func();
        return true;
      }
      return false;
    }
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

