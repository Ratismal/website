<template>
  <div>
    <textarea v-model="stringified"/>
    <button class="button full" @click.prevent="persist">Persist</button>
    <button class="button full" @click.prevent="save">Save</button>
    <span class="error">{{ error }}</span>
  </div>
</template>


<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      temp: "",
      displayed: "",
      error: ""
    };
  },
  computed: {
    stringified: {
      get() {
        return this.displayed || JSON.stringify(this.data, null, 2);
      },
      set(value) {
        this.temp = value;
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.displayed = "";
      },
      deep: true
    }
  },
  methods: {
    persist() {
      try {
        let obj = JSON.parse(this.temp || JSON.stringify(this.data));
        for (const key in obj) {
          this.data[key] = obj[key];
        }
        this.error = "";
        this.displayed = "";
      } catch (err) {
        console.log(this.temp);
        this.error = err.message;
        this.displayed = this.temp;
      }
    },
    async save() {
      this.persist();
      try {
        this.$axios.$post(
          "/dnd/character/" + this.$route.params.id,
          this.data,
          {
            headers: {
              authorization: localStorage.token
            }
          }
        );
      } catch (err) {
        this.error = err.message;
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
