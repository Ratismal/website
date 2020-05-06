<template>
  <div :class="{[layout]: true}" class="wrapper">
    <div class="streams">
      <iframe
        v-for="channel of channels"
        :key="channel"
        :id="'embed_' + channel"
        :src="`http://player.twitch.tv/?muted=true&channel=${channel}`"
        class="stream" />
    </div>
    <div class="chats">
      <div v-for="channel of channels" :key="channel" :id="'chat_' + channel" class="chat">
        <iframe
          :id="'embed_' + channel" :src="`http://twitch.tv/chat/embed?channel=${channel}&popout_chat=true`"
          height="100%"
          class="stream" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'custom',
  data() {
    return {
      channels: [],
      layout: 'default'
    };
  },
  mounted() {
    this.channels = this.$route.params.id.split(',');
    console.log(this.channels);
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;

  height: 100vh;
  width: 100vw;

  grid-template-areas: "streams chat";

  .streams {
    grid-area: streams;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .stream {
      flex: 1 1 auto;
      border: none;
    }
  }

  .chats {
    grid-area: chat;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .chat {
      flex: 1 1 auto;
      border: none;

      iframe {
        border: none;
        margin: 0 auto;
      }
    }
  }
}
</style>