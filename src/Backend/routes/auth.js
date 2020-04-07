const Route = require('./route');
const sf = require('snekfetch');
const Security = require('../Security');
const config = require('../../../config.json');

const BASE_ENDPOINT = 'https://discordapp.com/api/v6/';
const TOKEN_ENDPOINT = 'https://discordapp.com/api/oauth2/token';
const USER_ENDPOINT = BASE_ENDPOINT + 'users/@me';

const Eris = require('eris');
const bot = new Eris(config.discord.token, {
  restMode: true
});
bot.connect();

module.exports = class AuthRoute extends Route {
  get prefix() {
    return '/auth';
  }

  setup() {
    this.router.get('/', this.ok.bind(this));

    this.router.get('/login', this.login.bind(this));
    this.router.post('/validate', this.validate.bind(this));
  }

  check(ctx) {
    const token = ctx.cookies.get('token');
    if (token) {
      const { id } = Security.validateToken(token);
      return id || false;
    }

    return false;
  }

  async ok(ctx) {
    ctx.status = 200;

    const id = this.check(ctx);
    if (id) {
      const user = await bot.getRESTUser(id);
      ctx.body = user;
    } else {
      ctx.body = false;
    }
  }

  async login(ctx) {
    ctx.redirect("https://discordapp.com/oauth2/authorize" +
      "?client_id=" + config.discord.id +
      "&scope=identify" +
      "&prompt=none" +
      "&response_type=code" +
      "&redirect_uri=" + config.discord.redirect);
  }

  async validate(ctx) {
    try {
      let res = await sf.post(TOKEN_ENDPOINT).set({
        'Content-Type': 'application/x-www-form-urlencoded'
      }).send({
        client_id: config.discord.id,
        client_secret: config.discord.secret,
        grant_type: 'authorization_code',
        code: ctx.request.body.code,
        redirect_uri: config.discord.redirect,
        scope: 'identify'
      });
      let access_token = res.body.access_token;

      res = await sf.get(USER_ENDPOINT).set('Authorization', 'Bearer ' + access_token);
      let token = Security.generateToken(res.body.id);

      ctx.cookies.set('token', token);

      ctx.status = 200;
      ctx.body = token;
    } catch (err) {
      console.error(err);
      ctx.status = 400;
      ctx.body = err.message;
    }
  }

};
