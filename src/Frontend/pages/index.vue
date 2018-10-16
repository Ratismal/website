<template>
  <main>
    <section>
      <h1>stupid cat
        <span class='subtitle'>
          coder | artist | musician
        </span>
      </h1>
    </section>

    <div class='parallax-wrapper'>
      <div class='parallax-container plx-avatar'>
      </div>
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
        I'm currently a third-year student at the
        <a href='http://nait.ca'>Northern Alberta Institute of Technology</a>
        , where I'm working towards my
        <a href='http://www.nait.ca/program_home_78547.htm'>Bachelor of Applied Information Systems Technology (BAIST)
        </a>.
      </p>

      <p>
        My favourite animals are a tie between
        <code>cats</code> and
        <code>paramecium</code>. I think they're both adorable.
      </p>
    </section>

    <div class='parallax-wrapper'>
      <div class='parallax-container plx-blargbot'>
      </div>
    </div>

    <section>
      <h2>Projects & Experience</h2>

      <p>I've worked at
        <a href='https://policywise.com/'>PolicyWise for Children & Families</a>
        for the past two years as a summer student, and am fortunate enough to be contracted
        <!-- -->
        part-time through school to continue my work.</p>
      <p>Additionally, I've created and maintain several projects, most of which are
        <a href='https://github.com/ratismal'>open-source</a>
        . This website is
        <a href='https://github.com/ratismal/website'>one of them</a>!</p>
      <p>My biggest ongoing project is
        <a href='https://blargbot.xyz'>blargbot</a>
        , a bot for the
        <a href='https://discordapp.com'>Discord</a>
        chat platform which specializes in moderation utilities and customization. blargbot features
        <code>BBTag</code>, a toy language which allows users to create incredibly complex custom commands.
      </p>

      <p>I'm also working on a couple of games as a side-project.</p>
    </section>

    <div class='parallax-wrapper'>
      <div class='parallax-container plx-games'>
      </div>
    </div>

    <section>
      <h2>Games</h2>
      <p>There are three games that I currently have in the works. Stay tuned for more details!</p>
    </section>
    <div class='parallax-wrapper'>
      <div class='parallax-container plx-lizard'>
      </div>
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
export default {

};
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
