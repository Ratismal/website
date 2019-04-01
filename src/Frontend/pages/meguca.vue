<template>
  <div class="catflex wrapper">
    <div class="character-wrapper catflex vertical between">
      <div class="character catflex vertical center">
        <img src="/img/meguca/madoka.png">
        <span class="name">madoka</span>
      </div>

      <div class="character catflex vertical center">
        <img src="/img/meguca/kyubey.png">
        <span class="name">kyubey</span>
      </div>

      <div class="character catflex vertical center">
        <img src="/img/meguca/mami.png">
        <span class="name">mami</span>
      </div>
      <div class="character catflex vertical center">
        <img src="/img/meguca/sayaka.png">
        <span class="name">sayaka</span>
      </div>
      <div class="character catflex vertical center">
        <img src="/img/meguca/homura.png">
        <span class="name">homura</span>
      </div>
    </div>
    <div class="questions grow">
      <h1>Super Cool Leadership Questions</h1>

      <div class="question-wrapper catflex vertical around">
        <span class="question">1. To what extent does Mami exhibit effective leadership? Ethical leadership?</span>
        <span class="question">2. To what extent does Kyubey exhibit effective leadership? Ethical leadership?</span>
        <span class="question">3. Kyubey never lied, except through omission. Have you been in a situation where your superior acted in this way? What effect did it have on your team?</span>
        <span class="question">4. Kyubey struggles to understand why people are upset with his leadership tactics. In what way might a cultural gap impact leadership in a real-life situation?</span>
        <span class="question">5. In what ways does Kyubey try to convince Madoka to become a magical girls? Does he exhibit transactional or transformational behaviour?</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "custom"
};
</script>

<style lang="scss" scoped>
.character-wrapper {
  .character {
    .name {
      font-size: 1.4em;
    }
  }
}

.wrapper {
  height: 100vh;
  width: 100vw;
  padding: 2rem;
  box-sizing: border-box;
}

.questions {
  margin: 0 2rem;

  .question-wrapper {
    max-width: 1000px;
    margin: 0 auto;

    .question {
      display: block;
      font-size: 1.6em;
      margin: 3rem 0;
    }
  }
}
</style>
