<template>
  <div>
    <textarea v-model="data.notes"/>

  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
