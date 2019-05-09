const Route = require('./route');
const routes = require('./index');

module.exports = class ApiRoute extends Route {
  get prefix() {
    return '/api';
  }
  
  setup() {
    this.router.param('id', async (id, ctx, next) => {
      ctx.state.id = id;
      await next();
    });

    this.router.get('/', async (ctx, next) => {
      ctx.body = 'Hello, world!';
    });

    this.routes = {};

    for (const key in routes) {
      this.routes[key] = new routes[key](this.frontend, key);
      this.routes[key].hook(this.router);
    }
  }
};
