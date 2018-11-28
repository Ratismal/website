<template>
  <main>
    <section>
      <div class="character-wrapper">
        <div class="avatar">
          <img src="/img/dnd/lintel/portrait.png" alt="portrait">
          <div class="stats-wrapper">
            <span class="key">Age:</span>
            <span class="value">11 years</span>
            <span class="key">Sex:</span>
            <span class="value">Male</span>
            <span class="key">Alignment:</span>
            <span class="value">Chaotic Good</span>
            <span class="key">Class:</span>
            <span class="value">Fighter</span>
            <span class="key">Ideals:</span>
            <span class="value">Protect the weak in the name of justice!</span>
            <span class="key">Bonds:</span>
            <span class="value">The Cytchenrok Clan</span>
            <span class="key">Flaws:</span>
            <span class="value">Rash, impulsive</span>
            <span class="key">Color:</span>
            <span class="value">Green (Poison)</span>
            <span class="key">Strength:</span>
            <span class="value">8+2 (+0)</span>
            <span class="key">Dexterity:</span>
            <span class="value">16 (+3)</span>
            <span class="key">Constitution:</span>
            <span class="value">10 (+0)</span>
            <span class="key">Intelligence:</span>
            <span class="value">13 (+1)</span>
            <span class="key">Wisdom:</span>
            <span class="value">10 (+0)</span>
            <span class="key">Charisma:</span>
            <span class="value">14+1 (+2)</span>
          </div>
        </div>
        <div class="content">
          <h1>Cytchenrok "Eggsitter" Lintel</h1>

          <p>
            Lintel was never the pick of the clutch. Always a bit of a runt,
            he was batted around by the others. Assigned to menial tasks,
            such as tending to eggs (earning him the nickname "Eggsitter").
            The constant subject of teasing and humiliation.
          </p>
          <p>
            But none of that mattered, for Lintel had a dream.
          </p>
          <p>
            He would be come a mighty adventurer, and bring pride and admiration to his clan!
          </p>
          <p>
            So, he trained. Despite his small stature, he could find his way around a sword.
            Sure, he wasn't very strong, but his nimbleness and dexterity made up for it.
          </p>
          <p>
            And then one night, unbeknownst to anyone, he slipped away with nothing but
            the thought of glory in his mind.
          </p>
          <p>
            Lintel's adventure was about to begin!
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.character-wrapper {
  display: flex;

  .avatar {
    flex: 0 1 auto;
    flex-basis: 0;

    img {
      height: 320px;
    }
  }

  .content {
    flex: 1 0 auto;
    margin: 0 2rem;
    flex-basis: 0;
  }
}

.stats-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  margin: 1rem;

  .key {
    text-align: right;
  }
}
</style>
