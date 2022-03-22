const Route = require('./route');
const config = require('../../../config.json');
const axios = require('axios');

const STEAM_ENDPOINT = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const STEAM_APP_ENDPOINT = 'https://store.steampowered.com/api/appdetails?appids=';
const STEAM_REVIEW_ENDPOINT = (id) => `https://store.steampowered.com/appreviews/${id}?json=1&language=all`;

module.exports = class DndRoute extends Route {
  constructor(...args) {
    super(...args);

    this.cache = [];
    this.lastCache = 0;
  }

  get prefix() {
      return '/gamekeys';
  }

  setup() {
    this.router.get('/keys', this.getKeys.bind(this));
    this.router.get('/keys/detailed', this.getDetailedKeys.bind(this));
    this.router.put('/key', this.addKey.bind(this));
    this.router.param('keyId', (id, ctx, next) => {
      ctx.state.keyId = id;
      return next();
    });
    this.router.delete('/key/:keyId', this.deleteKey.bind(this));
    // this.router.post('/character/:id', this.setDndCharacter.bind(this));
  }

  check(ctx) {
    ctx.assert(ctx.state.auth, 403, 'You are not authorized');
    ctx.assert(ctx.state.auth.id === config.ownerId, 401, 'You cannot manage keys');
  }

  async getDetailedKeys(ctx, next) {
    this.check(ctx);

    const keys = await this.db.game_key.findAll();

    ctx.status = 200;
    ctx.body = keys;
  }

  async getKeys(ctx, next) {
    const keys = await this.db.game_key.findAll();

    ctx.status = 200;
    ctx.body = keys.map(key => ({
      title: key.title,
      link: key.link,
      appId: key.appId,
      headerImage: key.headerImage,
      meta: key.meta,
      id: key.id
    }));
  }

  async cacheGames() {
    if (this.cache.length === 0 || Date.now() - this.lastCache > 1000 * 60 * 60 * 24) {
      this.lastCache = Date.now();
      const res = await axios.get(STEAM_ENDPOINT);
      console.log(res);
      this.cache = res.data.applist.apps;
    }
  }

  async checkGame(title) {
    await this.cacheGames();

    console.log(this.cache.length);

    const game = this.cache.find(g => g.name.toLowerCase() === title.toLowerCase());

    if (game) {
      const res = await axios.get(STEAM_APP_ENDPOINT + game.appid);
      const reviews = await axios.get(STEAM_REVIEW_ENDPOINT(game.appid));
      return {
        ...game,
        data: res.data[game.appid].data,
        reviews: reviews.data.query_summary
      };
    }

    return null;
  }

  async addKey(ctx, next) {
    this.check(ctx);

    const { key, title } = ctx.request.body;

    const game = await this.checkGame(title);
    console.log(game);
    ctx.assert(game, 400, 'Game not found');

    const gameKey = await this.db.game_key.create({
      key,
      appId: game.appid,
      title: game.name,
      link: `https://store.steampowered.com/app/${game.appid}/`,
      headerImage: game.data.header_image,
      meta: {
        reviews: game.reviews
      }
    });

    ctx.status = 200;
    ctx.body = gameKey;
  }

  async deleteKey(ctx) {
    this.check(ctx);

    const id = ctx.state.keyId;
    const key = await this.db.game_key.findById(id);

    console.log(key);
    ctx.assert(key, 404, 'Key not found');

    await key.destroy();
    ctx.status = 200;
    ctx.body = 'OK';
  }
};