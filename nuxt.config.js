const config = require('./config.json');

module.exports = {
  srcDir: 'src/Frontend',
  /*
  ** Headers of the page
  */
  head: {
    title: 'stupid cat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'stupid cat\'s personal website' },
      { name: 'keywords', content: 'stupid cat, kirkland morrill, ratismal' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],

    script: [
      // google analytics
      { src: 'https://www.googletagmanager.com/gtag/js?id=UA-28511548-8', async: true },
      { src: '/js/ganalytics.js' },
    ],
  },
  dev: config.beta,

  /*
  ** Global CSS
  */
  css: [{ src: '@/assets/scss/base.scss', type: 'scss' }],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  modules: [
    ['@nuxtjs/axios', {
      prefix: '/api',
      proxy: true,
      port: 8109,
    }],
  ],
  proxy: {
    '/api/': config.origin || 'https://stupidcat.me',
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** Run ESLINT on save
     */
    extend(conf, ctx) {
      if (ctx.isClient) {
        conf.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }

      // Override the webpack progress bar plugin because it's VERY ANNOYING
      const plugin = conf.plugins.find(p => p.constructor.name === 'WebpackBarPlugin');
      let p = -1;
      plugin.handler = (percent, msg) => {
        const formattedPercent = Math.floor(percent * 100);
        if (formattedPercent !== p && formattedPercent % 50 === 0) {
          (console.nuxt || console.log)(`Compiling ${ctx.isClient ? 'client' : 'server'}: ${formattedPercent}%`, msg);
          p = formattedPercent;
        }
      };
    },
  },
};
