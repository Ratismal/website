const Router = require('koa-router');

module.exports = class Route {
    constructor(frontend) {
        this.frontend = frontend;
        this.router = new Router({
            prefix: this.prefix
        });

        this.setup();
    }

    // OVERRIDE THIS
    get prefix() {
        return '/base';
    }

    get backend() {
        return this.frontend.backend;
    }

    get db() {
        return this.backend.db;
    }

    // OVERRIDE THIS
    setup() {
        // NO-OP
    }

    hook(parent) {
        console.website('Hooking', this.prefix);
        parent.use(this.router.routes(), this.router.allowedMethods());
    }
}