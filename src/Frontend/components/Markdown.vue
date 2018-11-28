<template>
  <div>
    <div ref="markdownSlot" class="hidden">
      <slot />
    </div>
    <div class="markdown" v-html="renderedContent"/>
  </div>
</template>

<script>
import marked from "marked";
import hljs from "highlight.js";

export default {
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mdContent: ""
    };
  },
  computed: {
    renderedContent() {
      return this.$markdown(this.mdContent);
    }
  },
  watch: {
    // Update newValue if v-model changes for whatever reason.
    content(val) {
      this.mdContent = val;
    }
  },
  mounted() {
    // Populate using slot or prop, on mount
    if (this.content) this.mdContent = this.content;
    else {
      const content = this.$refs.markdownSlot.innerHTML;
      // const firstLine = content.split('\n').filter(l => !!l)[0]; // Unindent to match first line

      // if (!firstLine) return '';

      // const spaces = firstLine.search(/\S|$/);
      // // aaaa this would fail with tabs :( needs work
      // const exp = new RegExp(`^ {${spaces}}`, 'gm');

      // content = content.replace(exp, '');
      this.mdContent = content;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
