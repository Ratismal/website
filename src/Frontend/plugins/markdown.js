import Vue from 'vue';
import marked from 'marked';
import hljs from 'highlight.js';

Vue.prototype.$markdown = str =>
  marked(str, {
    highlight: (code, lang) =>
      (lang ? hljs.highlight(lang, code, true) : hljs.highlightAuto(code)).value
  });
