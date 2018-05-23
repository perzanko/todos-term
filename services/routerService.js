const routes = require('./../commands');
const chalk = require('chalk');


class RouterService {
  constructor() {
    this.routes = routes;
  }

  goTo(route, argArr, isGlobal) {
    if (!route) return null;
    const foundRoute = this.routes.find((item) => item.name === route);
    const { module: Module } = foundRoute;
    console.log(chalk.grey(`> ${foundRoute.namespace} ${isGlobal ? 'GLOBAL' : ''}`));
    return foundRoute && Module ? new Module(isGlobal, argArr) : null;
  }
}


module.exports = new RouterService();