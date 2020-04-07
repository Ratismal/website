const Route = require('./route');
const Security = require('../Security');

module.exports = class DndRoute extends Route {
  get prefix() {
    return '/stalk';
  }

  setup() {
    this.router.get('/:id', this.getMarket.bind(this));
    this.router.post('/', this.setMarket.bind(this));
    // this.router.put('/private/:id', this.createMarket.bind(this));
  }

  async getMarket(ctx) {
    ctx.status = 200;
    const market = await this.db.stalk_market.findOrCreate({
      where: {
        id: ctx.state.id
      },
      defaults: {
        id: ctx.state.id,
        data: "null"
      }
    });

    ctx.assert(market, 404, 'A market was not found');

    ctx.body = {
      data: JSON.parse(market[0].data)
    };
  }

  async setMarket(ctx) {
    ctx.status = 200;
    ctx.assert(ctx.state.auth, 401, 'Unauthorized');
    const body = ctx.request.body;

    await this.db.stalk_market.upsert({
      id: ctx.state.auth.id,
      data: JSON.stringify(body.data)
    });
  }
};
