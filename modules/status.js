const listService = require('./../services/listService');


/**
 * Status module. Shows table with .todos
 *
 * @class Status
 */
class Status {
  /**
   * Creates an instance of Status.
   * @memberof Status
   */
  constructor() {
    this.render();
  }


  /**
   * Render prompt form
   *
   * @memberof Status
   */
  render() {
    listService.changeItemStatus();
  }
}


module.exports = Status;
