const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { Nuxt, Builder } = require('nuxt');
const nuxtConfig = require('../../nuxt.config.js');
const Security = require('../Backend/Security');

const ApiRoute = require('../Backend/routes/api');

class Frontend {
  constructor(backend) {
    this.config = backend.config;
    this.backend = backend;

    this.app = new Koa();
    this.nuxtConfig = nuxtConfig;

    this.nuxt = new Nuxt(this.nuxtConfig);

    console.info('Dev mode:', this.nuxtConfig.dev);
    if (this.nuxtConfig.dev) {
      const builder = new Builder(this.nuxt);
      builder.build();
    }

    this.app.use(bodyParser());

    this.app.use(async (ctx, next) => {
      ctx.status = 200;
      try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          message: err.message
        };
      }
      console.log('Middleware Complete: %s', ctx.path);
    });

    this.app.use(async (ctx, next) => {
      let token = ctx.request.headers.authorization || ctx.cookies.get('token');
      let parsed = Security.validateToken(token);
      ctx.state.auth = parsed;
      await next();
    });



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


    this.app.use(async (ctx, next) => {
      ctx.status = 404;
      return next();
    });
    this.apiRoute = new ApiRoute(this, 'api');
    this.apiRoute.hook(this.app);
  }

  start() {
    this.server = this.app.listen(this.config.port);
    console.website('Website listening on port %d!', this.config.port);
  }
}

module.exports = Frontend;
