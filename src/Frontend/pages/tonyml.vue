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
      <hr>
      <div class="input-field">
        <span>Current Row</span>
        <input v-model="currentIndex" type="number">
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
            additional: null
          }
        }
      ],
      title: "Cool Table",
      currentIndex: 0
    };
  },
  methods: {
    newField() {
      this.rows.push({
        _id: Date.now(),
        pk: false,
        fk: false,
        name: "NewField",
        type: "Number",
        nullable: false,
        traits: {
          size: null,
          order: null,
          references: null,
          additional: null
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
        .filter(t => row.traits[t] !== null)
        .map(t => {
          let val = row.traits[t];
          if (t === "additional") return val;
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

