const moment = require('moment');
const Table = require('cli-table');
const Logger = require('./../services/loggerService');
const ListService = require('./../services/listService');
const chalk = require('chalk');


class List {
  constructor() {
    this.list = ListService.getList().list;
    if (!this.list.length) Logger(".todos is empty. Add todo using command 'todos create'", 'blue');
    this.table = new Table({
      // head: ['ID', ...Object.keys(this.list[0]).slice(1)], // meta //TODO: meta
      head: ['ID', 'Name', 'Timetable', 'Priority', 'Status'].map((item) => chalk.blue.bold(item)),
      // colWidths: [100, 200],
      // chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
      //    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
      //    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
      //    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
    this.init();
  }

  init() {
    this.list.forEach((item, index) => {
      const statusColor = item.status === 'DONE' ? 'green' : (item.status === 'TODO' ? 'red' : 'yellow');
      this.table.push([
        chalk.grey.bold(index + 1),
        chalk.bold(item.name || '-'),
        item.timetable && item.timetable !== 'null' ? (moment(item.timetable).calendar() || '-') : '-',
        chalk.bold(item.priority || '-'),
        chalk.bold[statusColor](item.status || '-'),
        // item.author || '-',
        // new Date(item.updatedAt).toLocaleDateString(),
        // new Date(item.createdAt).toLocaleDateString(),
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
    console.log(this.table.toString());
  }
}

module.exports = List;
