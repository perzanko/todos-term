const commands = require('./../commands');
const Logger = require('./../services/loggerService');


/**
 * Comman resolve service.
 * Parse input and invoke command by given arg.
 *
 * @class CommandResolverService
 */
class CommandResolverService {
  /**
   * Creates an instance of CommandResolverService.
   * @memberof CommandResolverService
   */
  constructor() {
    this.commands = this.getCommands(commands);
  }


  /**
   * Parse arguments from user's input.
   *
   * @param {string} argv
   * @returns
   * @memberof CommandResolverService
   */
  parse(argv) {
    const route = this.commands[this.handleInput(argv)];
    if (route) {
      return route;
    }
    Logger(`There is not command ${this.handleInput(argv)}! ;(`, 'red');
    return null;
  }


  /**
   * Extract argument from args array.
   *
   * @param {string} argv
   * @returns {string}
   * @memberof CommandResolverService
   */
  handleInput(argv) {
    const arrOfArgs = argv.slice(2);
    return arrOfArgs[0] ? arrOfArgs[0] : '';
  }


  /**
   * Get all commands from commands.js
   *
   * @param {array} arr
   * @returns {object}
   * @memberof CommandResolverService
   */
  getCommands(arr) {
    const result = {};
    arr.forEach((route) => {
      route.commands.forEach((command) => {
        result[command] = route.name;
      });
    });
    return result;
  }
}


module.exports = new CommandResolverService();
