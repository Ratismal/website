<template>
  <div>
    <div class="stats-wrapper">
      <span class="key">Race:</span>
      <span class="value">{{ data.race }}</span>
      <span class="key">Age:</span>
      <span class="value">{{ data.age }}</span>
      <span class="key">Sex:</span>
      <span class="value">{{ data.male === true ? 'Male' : data.male === false ? 'Female' : 'Other' }}</span>
      <span class="key">Alignment:</span>
      <span class="value">{{ data.alignment }}</span>
      <span class="key">Class:</span>
      <span class="value">{{ data.class.join('-') }}</span>
      <span class="key">Ideals:</span>
      <span class="value">{{ data.ideals }}</span>
      <span class="key">Bonds:</span>
      <span class="value">{{ data.bonds }}</span>
      <span class="key">Flaws:</span>
      <span class="value">{{ data.flaws }}</span>
      <template v-for="(cAttr, key) in data.customAttributes">
        <span :key="key" class="key">{{ key }}:</span>
        <span :key="cAttr" class="value">{{ cAttr }}</span>
      </template>
    </div>
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

<style lang="scss" scoped>
@import "~/assets/scss/dnd.scss";
</style>
