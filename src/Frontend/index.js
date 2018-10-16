const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { Nuxt, Builder } = require('nuxt');
const nuxtConfig = require('../../nuxt.config.js');

const ApiRoute = require('./routes/api');

class Frontend {
  constructor(backend) {
    this.config = backend.config;
    this.backend = backend;

    this.app = new Koa();
    this.nuxtConfig = nuxtConfig;

    this.nuxt = new Nuxt(this.nuxtConfig);
    if (this.nuxtConfig.dev) {
      const builder = new Builder(this.nuxt);
      builder.build();
    }

    this.app.use(bodyParser());

    this.app.use(async (ctx, next) => {
      ctx.status = 200;
      await next();
      console.log('Middleware Complete: %s', ctx.path);
    });

    this.apiRoute = new ApiRoute(this);

    this.app.use(async (ctx, next) => {
      if (!ctx.path.startsWith('/api')) {
        return new Promise((res, rej) => {
          ctx.res.on('close', res);
          ctx.res.on('finish', res);

          this.nuxt.render(ctx.req, ctx.res, promise => promise.then(res).catch(rej));
        });
      }
      return next();
    });

    this.server = null;
  }

  start() {
    this.server = this.app.listen(this.config.port);
    console.website('Website listening on port %d!', this.config.port);
  }
}

module.exports = Frontend;
