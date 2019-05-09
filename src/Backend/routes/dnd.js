const Route = require('./route');

module.exports = class DndRoute extends Route {
  get prefix() {
      return '/dnd';
  }

  setup() {
    this.router.get('/character/:id', this.getDndCharacter.bind(this));
    this.router.post('/character/:id', this.setDndCharacter.bind(this));
  }

  async getDndCharacter(ctx, next) {
    const char = await this.db.dnd_character.findByPk(ctx.state.id);
    ctx.assert(char, 404, 'A character was not found');

    let values = char.dataValues;
    if (!ctx.state.auth || char.ownerId !== ctx.state.auth.id) {
      values.notes = '[REDACTED]';
    }
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
