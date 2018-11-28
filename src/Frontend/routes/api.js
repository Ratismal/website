const Router = require('koa-router');

module.exports = class ApiRoute {
  constructor(frontend) {
    this.frontend = frontend;

    this.router = new Router({
      prefix: '/api'
    });

    this.router.param('id', async (id, ctx, next) => {
      ctx.state.id = id;
      await next();
    });

    this.router.get('/', async (ctx, next) => {
      ctx.body = 'Hello, world!';
    });

    this.router.get('/dnd/character/:id', this.getDndCharacter.bind(this));
    this.router.post('/dnd/character/:id', this.setDndCharacter.bind(this));

    this.frontend.app.use(this.router.routes()).use(this.router.allowedMethods());
  }

  get backend() {
    return this.frontend.backend;
  }

  get db() {
    return this.backend.db;
  }

  async getDndCharacter(ctx, next) {
    const char = await this.db.dnd_character.findByPk(ctx.state.id);
    let values = char.dataValues;
    if (!ctx.state.auth || char.ownerId !== ctx.state.auth.id) {
      values.notes = '[REDACTED]';
    }
    ctx.assert(char, 404, 'A character was not found');
    ctx.body = char.dataValues;
  }

  async setDndCharacter(ctx, next) {
    let body = ctx.request.body;
    body.username = ctx.state.id;
    body.ownerId = ctx.state.auth.id;
    delete body.createdAt;
    delete body.updatedAt;
    ctx.assert(ctx.state.auth, 403, 'You are not authorized');
    let char = await this.db.dnd_character.findByPk(ctx.state.id);
    if (char) {
      ctx.assert(char.ownerId === ctx.state.auth.id, 403, 'You do not own this beautiful baby');
    }
    await this.db.dnd_character.upsert(body);
    ctx.body = { message: 'OK' };
  }
};
