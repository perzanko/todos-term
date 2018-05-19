const routes = require('./../commands');
const chalk = require('chalk');


class RouterService {
  constructor() {
    this.routes = routes;
  }

  goTo(route, ...args) {
    if (!route) return null;
    const foundRoute = this.routes.find((item) => item.name === route);
    const { module: Module } = foundRoute;
    console.log(chalk.grey(`> ${foundRoute.namespace}`));
    return foundRoute && Module ? new Module(...args) : null;
  }
}


module.exports = new RouterService();