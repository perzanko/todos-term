const moment = require('moment');
const Table = require('cli-table');
const chalk = require('chalk');
const Logger = require('./../services/loggerService');
const ListService = require('./../services/listService');


/**
 * List module. Shows table with .todos
 *
 * @class List
 */
class List {
  /**
   * Creates an instance of List.
   * @memberof List
   */
  constructor(isGlobal) {
    ListService.setGlobal(isGlobal);
    this.list = ListService.getList().list;
    if (!this.list.length) Logger(".todos is empty. Add todo using command 'todos create'", 'blue');
    this.table = new Table({
      head: ['ID', 'Name', 'Timetable', 'Priority'].map((item) => chalk.blue.bold(item)),
    });
    this.render();
  }


  /**
   * Render table
   *
   * @memberof List
   */
  render() {
    this.list.forEach((item, index) => {
      this.table.push([
        chalk.grey.bold(index + 1),
        chalk[this.gerColorStatus(item.status)](' •   ') + chalk.bold(item.name || '-'),
        item.timetable && item.timetable !== 'null' ? (this.getCalendarDate(item.timetable) || '-') : '-',
        chalk.bold(item.priority || '-'),
      ]);
      // TODO: meta
      // this.table.push([
      //   index + 1,
      //   item.name || '-',
      //   item.timetable || '-',
      //   item.priority || '-',
      //   item.status || '-',
      //   item.author || '-',
      //   new Date(item.updatedAt).toLocaleDateString(),
      //   new Date(item.createdAt).toLocaleDateString(),
      // ]);
    });
    console.log(`${chalk.green('•')} - DONE   ${chalk.yellow('•')} - IN PROGRESS   ${chalk.red('•')} - TO DO`);
    console.log(this.table.toString());
  }


  /**
   * Helper method to status colors.
   *
   * @param {string} status
   * @returns {string}
   * @memberof List
   */
  gerColorStatus(status) {
    const statusColors = {
      'TODO': 'red',
      'DONE': 'green',
      'IN PROGRESS': 'yellow',
    };
    return statusColors[status];
  }


  /**
   * Parse calendar day.
   * Red color when timetable is outdated.
   *
   * @param {number} timetable
   * @returns {string}
   * @memberof List
   */
  getCalendarDate(timetable) {
    const calendarText = moment(timetable).calendar();
    if (moment().diff(moment(timetable)) >= 0) {
      return chalk.red(calendarText);
    }
    return calendarText;
  }
}


module.exports = List;
