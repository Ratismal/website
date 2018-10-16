const Router = require('koa-router');

module.exports = class ApiRoute {
  constructor(frontend) {
    this.frontend = frontend;
    this.backend = this.frontend.backend;

    this.router = new Router({
      prefix: '/api',
    });

    this.router.get('/', async (ctx) => {
      ctx.body = 'Hello, world!';
    });

    this.frontend.app.use(this.router.routes()).use(this.router.allowedMethods());
  }
};
