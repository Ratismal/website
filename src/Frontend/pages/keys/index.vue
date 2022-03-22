<template>
  <main>
    <section>
      <h1>Game Keys</h1>
      <p>
        This is a collection of game keys that I would like to give away.
        If there's a key in the list that you'd like, and I know you in some capacity, please contact me!
      </p>

      <div class="game-wrapper">
        <div v-for="key in keys" :key="key.id" class="game">
          <div class="game-image">
            <img :src="key.headerImage" >
          </div>
          <div class="title">
            {{ key.title }}
          </div>
          <div class="rating">
            ({{ key.meta.reviews.review_score_desc }}:
            {{ (key.meta.reviews.total_positive / key.meta.reviews.total_reviews * 100).toFixed(0) }}%)
          </div>
          <div class="spacer"/>
          <div class="link">
            <a :href="key.link" target="_blank">Link</a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get('/gamekeys/keys');
    return {
      keys: data
    };
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
</style>