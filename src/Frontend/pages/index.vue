<template>
  <main>
    <section>
      <h1>stupid cat
        <span class="subtitle">
          coder | artist | musician
        </span>
      </h1>
    </section>

    <div class="parallax-wrapper">
      <div class="parallax-container plx-avatar"/>
    </div>

    <section>
      <h2>Salutations!</h2>

      <p>
        My name is
        <code>Kirkland Morrill</code>, but I also go by the aliases
        <code>stupid cat</code> and
        <code>ratismal</code>.
      </p>

      <p>
        I'm a graduate of the
        <a href="http://nait.ca">Northern Alberta Institute of Technology</a>, with a
        <a href="http://www.nait.ca/program_home_78547.htm">Bachelor of Applied Information Systems Technology (BAIST)
        </a>.
      </p>

      <p>
        My favourite animals are a tie between
        <code>cats</code> and
        <code>paramecium</code>. I think they're both adorable.
      </p>
    </section>

    <div class="parallax-wrapper">
      <div class="parallax-container plx-blargbot"/>
    </div>

    <section>
      <h2>Projects & Experience</h2>

      <p>Outside from work, I create and maintain several projects, most of which are
        <a href="https://github.com/ratismal">open-source</a>. This website is
      <a href="https://github.com/ratismal/website">one of them</a>!</p>
      <p>My biggest ongoing projects are
        <a href="https://blargbot.xyz">blargbot</a> and <a href="https://github.com/ratismal/uno">UNO</a>, bots for the
        <a href="https://discordapp.com">Discord</a>
        chat platform which specializes in moderation utilities and customization.
        <code>blargbot</code> features
        <code>BBTag</code>, a toy language which allows users to create incredibly complex custom commands.
      </p>

      <p>I'm also working on a couple of games as a side-project.</p>
    </section>

    <div class="parallax-wrapper">
      <div class="parallax-container plx-games"/>
    </div>

    <section>
      <h2>Games</h2>
      <p>There are three games that I currently have in the works. Stay tuned for more details!</p>
    </section>
    <div class="parallax-wrapper">
      <div class="parallax-container plx-lizard"/>
    </div>

    <section>
      <h2>Here's a lizard for scale.</h2>
      <p>His name is
      <code>Mali</code>. He's old and a bit senile and I love him very much.</p>
      <p>:3</p>

    </section>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.plx-avatar {
  background-image: url("/img/avatar.gif");
}
.plx-blargbot {
  background-image: url("/img/blargbot.png");
}
.plx-games {
  background-image: url("/img/games.png");
}
.plx-lizard {
  background-image: url("/img/lizard.jpg");
}
</style>
