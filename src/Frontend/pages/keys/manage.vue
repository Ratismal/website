<template>
  <main>
    <section>
      <h1>Game Keys Manager</h1>

      <template v-if="message">
        <p class="message">{{ message }}</p>
      </template>
      <div v-else class="game-wrapper">
        <table>
          <thead>
            <tr>
              <th>Header</th>
              <th>Title</th>
              <th>Key</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in keys" :key="key.id">
              <td class="game-image"><img :src="key.headerImage"></td>
              <td>{{ key.title }}</td>
              <td><code @click.prevent="copy(key.key)">{{ key.key }}</code></td>
              <td>
                <button class="button danger full" @click.prevent="deleteKey(key.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="field-group">
          <label>Title</label>
          <input v-model="title" type="text">
          <label>Key</label>
          <input v-model="key" type="text" placeholder="XXXXX-XXXXX-XXXXX">
          <button class="button" @click.prevent="addKey">Add</button>
        </div>
        <div v-if="error">{{ error }}</div>

        <button class="button" @click.prevent="refresh">Refresh</button>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get('/gamekeys/keys/detailed');
      return {
        keys: data,
        message: false
      };
    } catch {
      return {
        keys: [],
        message: 'You cannot manage keys'
      };
    }
  },
  data() {
    return {
      key: '',
      title: '',
      error: ''
    };
  },
  methods: {
    async deleteKey(id) {
      await this.$axios.$delete(`/gamekeys/key/${id}`);
      this.keys = this.keys.filter(key => key.id !== id);
    },
    copy(key) {
      navigator.clipboard.writeText(key);
    },
    async addKey() {
      try {
        await this.$axios.$put('/gamekeys/key', {
          key: this.key,
          title: this.title
        });
        this.key = '';
        this.title = '';
        this.error = '';

        this.keys = await this.$axios.$get('/gamekeys/keys/detailed');
      } catch {
        this.error = 'Something went wrong. Perhaps game could not be found?';
      }
    },
    async refresh() {
      await this.$axios.$post('/gamekeys/keys/refresh');
      this.keys = await this.$axios.$get('/gamekeys/keys/detailed');

      console.log(this.keys);
    }
  }
};
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
}

.game {
  display: flex;
  align-items: center;
  gap: 20px;
}

.game-image img {
  height: 60px;
}

.rating {
  font-size: 0.8em;
}

.spacer {
  flex: 1 0 auto;
}

.game-wrapper table td {
  text-align: center;
}

.field-group {
  gap: 10px;
}
</style>