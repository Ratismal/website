<template>
  <div>
    <markdown v-if="obtained" :content="data.story"/>
    <div v-else>
      There's nothing here. Why not make this character real?
    </div>
  </div>
</template>

<script>
import Markdown from "~/components/Markdown.vue";

export default {
  components: { Markdown },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    obtained: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
