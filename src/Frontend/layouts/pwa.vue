<template>
  <div id="nuxt-wrapper" class="grey darken-4 pwa">
    <nuxt />
    <footer-bar />
    <toaster ref="toaster" />
  </div>
</template>

<script>
import FooterBar from "~/components/pwa/FooterBar.vue";
import Toaster from "~/components/Toaster.vue";

export default {
  components: { FooterBar, Toaster },
  head: {
    link: [{ rel: "manifest", href: "/manifest.json" }]
  },
  mounted() {
    if (process.client) {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
          navigator.serviceWorker
            .register("/sw.js", {
              scope: "."
            })
            .then(
              function(registration) {
                // Registration was successful
                console.log(
                  "ServiceWorker registration successful with scope: ",
                  registration.scope
                );
              },
              function(err) {
                // registration failed :(
                console.log("ServiceWorker registration failed: ", err);
              }
            );
        });
      }
    }
  }
};
</script>