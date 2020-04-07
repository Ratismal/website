<template>
  <div>
    <template v-if="$store.state.user">
      <h1>Henlo stinky {{ $store.state.user.username }}</h1>
      <stalks :id="$store.state.user.id" :edit="true"/>
    </template>
  </div>
</template>

<script>
import Stalks from '@/components/stalks.vue';

export default {
  components: {
    Stalks
  },
  mounted() {
    if (!this.$store.state.user) {
      this.$router.push('/login');
    }
  }
};
</script>