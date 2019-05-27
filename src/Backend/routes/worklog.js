const Route = require('./route');
const moment = require('moment');

module.exports = class WorkLogRoute extends Route {
  get prefix() {
    return '/worklog';
  }

  setup() {
    this.router.use(async (ctx, next) => {
      let password = ctx.request.headers.wlpass || ctx.request.query.p;
      ctx.assert(password === this.backend.config.worklogPassword, 403, 'Incorrect password.');
      await next();
    });

    this.router.param('date', async (date, ctx, next) => {
      console.log(date);
      const d = moment(date, 'YYYY-MM-DD');
      console.log(d.format());
      ctx.assert(d.isValid(), 400, 'A valid date must be provided in the format "yyyy-mm-dd"');
      ctx.state.date = d;
      await next();
    });

    this.router.get('/check', this.check.bind(this));
    this.router.get('/all', this.getAll.bind(this));
    this.router.get('/day/:date', this.getLog.bind(this));
    this.router.post('/day/:date', this.setLog.bind(this));
    this.router.delete('/day/:date', this.deleteLog.bind(this));
  }

  async check(ctx) {
    ctx.status = 200;
    ctx.body = 'hi';
  }

  async getAll(ctx) {
    const logs = await this.db.worklog.findAll({
      where: {},
      order: [['date', 'ASC']],
      attributes: ['date']
    });
    ctx.status = 200;
    ctx.body = logs.map(l => l.dataValues);
  }

  async getLog(ctx) {
    const log = await this.db.worklog.findOne({
      where: {
        date: ctx.state.date.format()
      }
    });
    console.log('Found entry', log.date, 'matching', ctx.state.date.format());
    ctx.assert(log, 404, 'Entry not found.');

    ctx.status = 200;
    ctx.body = log.dataValues;
  }

  async setLog(ctx) {
    const body = ctx.request.body;

    const payload = {
      completed: body.completed,
      todo: body.todo,
      issues: body.issues,
      blocking: body.blocking,
      extra: body.extra,
      date: ctx.state.date.format()
    };

    await this.db.worklog.upsert(payload);

    ctx.status = 200;
    ctx.body = { message: 'ok' };
  }

  async deleteLog(ctx) {
    const log = await this.db.worklog.findOne({
      where: {
        date: ctx.state.date.format()
      }
    });

    ctx.assert(log, 404, 'Entry not found.');

    await log.destroy();
    ctx.status = 200;
    ctx.body = { message: 'ok' };
  }

};
