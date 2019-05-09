const Route = require('./route');

module.exports = class AuthRoute extends Route {
  get prefix() {
      return '/auth';
  }

  setup() {
    this.router.get('/', this.ok.bind(this));
  }

  async ok(ctx) {
    ctx.status = 200;
    ctx.body = 'hi';
  }

};
