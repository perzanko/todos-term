const commands = require('./../commands');


class CommandResolverService {
  constructor(input) {
    this.commands = this.getCommands(commands);
  }


  parse(argv) {
    const route = this.commands[this.handleInput(argv)];
    if (route) {
      return route;
    }
    console.info(`There is not command ${this.handleInput(argv)}! ;(`)
    return null;
  }


  handleInput(argv) {
    const arrOfArgs = argv.slice(2);
    return arrOfArgs[0] ? arrOfArgs[0] : ''
  }


  getCommands(arr) {
    let result = {};
    arr.forEach((route) => {
      route.commands.forEach((command) => {
        result[command] = route.name
      });
    });
    return result;
  }
}


module.exports = new CommandResolverService();