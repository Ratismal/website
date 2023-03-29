const Route = require('./route');
const config = require('../../../config.json');
const axios = require('axios');

const fs = require('fs').promises;
const path = require('path');


const STEAM_ENDPOINT = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const STEAM_APP_ENDPOINT = 'https://store.steampowered.com/api/appdetails?&language=en_ca&appids=';
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
    this.router.post('/keys/refresh', this.refreshKeys.bind(this));
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
      expiry: key.expiry,
      meta: {
        reviews: key.meta.reviews,
        data: {
          price_overview: key.meta.data.price_overview
        }
      },
      id: key.id
    }));
  }

  async cacheGames() {
    if (this.cache.length === 0 || Date.now() - this.lastCache > 1000 * 60 * 60 * 24) {
      this.lastCache = Date.now();
      const res = await axios.get(STEAM_ENDPOINT);
      console.log(res);
      this.cache = res.data.applist.apps;

      await fs.writeFile(path.join(__dirname, '..', '..', 'Frontend', 'static', 'gameCache.json'), JSON.stringify(this.cache));
    }
  }

  async checkGame(title) {
    await this.cacheGames();

    console.log(this.cache.length);
    let game = this.cache.find(g => g.name.toLowerCase() === title.toLowerCase());

    if (!game) {
      const stripRegex = /[^a-zA-Z0-9]/g;
      const strippedTitle = title.toLowerCase().replace(stripRegex, '');
      game = this.cache.find(g => g.name.toLowerCase().replace(stripRegex, '') === strippedTitle);
    }

    if (/^\d+$/.test(title)) {
      game = {
        appid: Number(title)
      };
    }

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

  async refreshKeys(ctx) {
    await this.check(ctx);

    const keys = await this.db.game_key.findAll();

    await this.cacheGames();

    setTimeout(async () => {
      for (const key of keys) {
        console.info('Caching game', key.title, key.appId);
        const res = await axios.get(STEAM_APP_ENDPOINT + key.appId);
        const reviews = await axios.get(STEAM_REVIEW_ENDPOINT(key.appId));

        const game = res.data[key.appId].data;

        // console.meta({ depth: 10 }).log(res.data[key.appId]);

        key.meta = {
          reviews: reviews.data.query_summary,
          data: game
        };
        key.title = game.name,
        key.link = `https://store.steampowered.com/app/${key.appId}/`,
        key.headerImage = game.header_image,

        await key.save();

        await this.sleep();
      }
    }, 1);

    ctx.body = 'OK';
    ctx.status = 200;
  }

  sleep() {
    return new Promise(res => {
      setTimeout(res, 5000);
    });
  }

  async addKey(ctx, next) {
    this.check(ctx);

    const { key, title, expiry } = ctx.request.body;

    const game = await this.checkGame(title);
    console.log(game);
    ctx.assert(game, 400, 'Game not found');

    const gameKey = await this.db.game_key.create({
      key,
      appId: game.appid,
      title: game.name,
      expiry: expiry ? new Date(expiry) : null,
      link: `https://store.steampowered.com/app/${game.appid}/`,
      headerImage: game.data.header_image,
      meta: {
        reviews: game.reviews,
        data: game.data
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
