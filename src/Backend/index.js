const CatLoggr = require('cat-loggr');
const Frontend = require('../Frontend');
const config = require('../../config.json');
const db = require('../../models');

const Chalk = CatLoggr._chalk; // eslint-disable-line no-underscore-dangle

new CatLoggr({
  level: config.beta ? 'debug' : 'info',
  levels: [
    { name: 'fatal', color: Chalk.red.bgBlack, err: true },
    { name: 'error', color: Chalk.black.bgRed, err: true },
    { name: 'warn', color: Chalk.black.bgYellow, err: true },
    { name: 'trace', color: Chalk.green.bgBlack, trace: true },
    { name: 'website', color: Chalk.black.bgCyan },
    { name: 'nuxt', color: Chalk.black.bgCyan },
    { name: 'init', color: Chalk.black.bgBlue },
    { name: 'info', color: Chalk.black.bgGreen },
    { name: 'verbose', color: Chalk.black.bgCyan },
    { name: 'debug', color: Chalk.magenta.bgBlack, aliases: ['log', 'dir'] }
  ]
}).setGlobal();

process.on('unhandledRejection', (err) => {
  console.error(err);
});

class Backend {
  constructor() {
    this.config = config;
    this.db = db;

    this.frontend = new Frontend(this);

    this.start();
  }

  start() {
    this.frontend.start();
  }
}

const backend = new Backend();

module.exports = backend;
