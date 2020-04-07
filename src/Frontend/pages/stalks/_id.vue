<template>
  <div>
    <stalks :id="id" :edit="false"/>
  </div>
</template>

<script>
import Stalks from '@/components/stalks.vue';

export default {
  components: {
    Stalks
  },
  data() {
    return {
      id: this.$route.params.id
    };
  },
  head() {
    return {
      title: 'Stalk Market',
      meta: [
        { hid: 'description', name: 'description', content: 'A utility to track the Stalk Market\'s trends.' }
      ]
    };
  }
};
</script>