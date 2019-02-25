<template>
  <main>
    <section>
      <h1>Grid Test</h1>
      <p>Just testing grids</p>

      <div class="catgrid">
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>
        <span class="col s1">1 span column</span>

        <span class="col s2">2 span column</span>
        <span class="col s2">2 span column</span>
        <span class="col s2">2 span column</span>
        <span class="col s2">2 span column</span>
        <span class="col s2">2 span column</span>
        <span class="col s2">2 span column</span>

        <span class="col s3">3 span column</span>
        <span class="col s3">3 span column</span>
        <span class="col s3">3 span column</span>
        <span class="col s3">3 span column</span>

        <span class="col s4">4 span column</span>
        <span class="col s4">4 span column</span>
        <span class="col s4">4 span column</span>

        <span class="col s6">6 span column</span>
        <span class="col s6">6 span column</span>

        <span class="col s4">8 span column</span>
        <span class="col s8">8 span column</span>

        <span class="col s12">12 span column</span>


        <span class="col s2 offset-s1">1 span column, offset 1</span>
        <span class="col s8 offset-s4">8 span column, offset 4</span>

        <span class="col s12"><br>Responsive Portion<br></span>

        <span class="col s12 m0 l0">You are on small</span>
        <span class="col s0 m12 l0">You are on medium</span>
        <span class="col s0 m0 l12">You are on large</span>


        <span class="col s6 m3 l2">column</span>
        <span class="col s6 m3 l2">column</span>
        <span class="col s12 m6 l4">column</span>
        <span class="col s12 m8 l6">column</span>
        <span class="col s6 hide-m hide-l">column</span>
        <span class="col s6 hide-m hide-l">column</span>
        <span class="col s6">column</span>
      </div>

      <h2>weird flex but ok</h2>
      <div class="catflex around">
        <span>child</span>
        <span>child</span>
        <span>child</span>
        <span>child</span>
      </div>
      <div class="catflex between center">
        <span class="grow">child grow</span>
        <span class="shrink">child shrink</span>
        <span class="grow">child grow</span>
        <span>child</span>
      </div>
      <div class="catflex vertical">
        <span>child</span>
        <span>child</span>
        <span>child</span>
        <span>child</span>
      </div>
      <div class="catflex horizontal vert-align">
        <div class="catflex vertical">
          <span class="title">Title</span>
          <span class="content">Content</span>
        </div>
        <div class="catflex vertical">
          <span class="title">Title</span>
          <span class="content">Content</span>
        </div>
        <div class="catflex vertical">
          <span class="title">Title</span>
          <span class="content">Content</span>
        </div>
        <span>Wow!</span>
        <span class="center">neat<br>o<br>!</span>
      </div>
    </section>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.col {
  margin: 1px;

  @each $size in (s, m, l) {
    &.#{$size}#{"1"} {
      background: red;
    }
    &.#{$size}#{"2"} {
      background: green;
    }
    &.#{$size}#{"3"} {
      background: blue;
    }
    &.#{$size}#{"4"} {
      background: orange;
    }
    &.#{$size}#{"6"} {
      background: purple;
    }
    &.#{$size}#{"8"} {
      background: cyan;
    }
    &.#{$size}#{"12"} {
      background: lime;
    }
  }
}
.catflex {
  border: 1px white solid;
  margin: 1rem 0;
}
.catflex > * {
  background: red;
  margin: 5px;
}
</style>
