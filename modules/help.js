const Table = require('cli-table');
const chalk = require('chalk');

class Help {
  constructor() {
    this.wiki = [
      {
        namespace: 'CREATE',
        description: `[create, crt, cr]${chalk.grey(' - Create your own .todos list and keep it locally in your directory.')}`,
      },
      {
        namespace: 'LIST',
        description: `[list, lst, ls, l]${chalk.grey(' - Display table with .todos.')}`,
      },
      {
        namespace: 'ADD',
        description: `[add, ad, a]${chalk.grey(' - Add .todos item to the list.')}`,
      },
      {
        namespace: 'REMOVE',
        description: `[remove, rem, rm, r]${chalk.grey(' - Remove .todos item from the list.')}`,
      },
      {
        namespace: 'STATUS',
        description: `[status, stat, st, s]${chalk.grey(' - Change status of .todos single item.')}`,
      },
      {
        namespace: 'EDIT',
        description: `[edit, ed, e]${chalk.grey(' - Edit single .todos item.')}`,
      },
      {
        namespace: 'CLEAR',
        description: `[clear, clr, cl, c]${chalk.grey(" - Clear all .todos items with status 'DONE'.")}`,
      },
      {
        namespace: 'HELP',
        description: `[help, h, -h]${chalk.grey(' - Show help tips.')}`,
      },
      {
        namespace: 'GLOBAL',
        description: `[...-g]${chalk.grey(' - You can manage your own .todos global as well.')}`,
      },
    ];
    this.render();
  }

  render() {
    const table = new Table({
      chars: {
        'top': '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': ' '
      },
      style: {
        'padding-left': 0,
        'padding-right': 6,
      },
    });
    this.wiki.forEach((item) => {
      table.push([chalk.magenta(item.namespace), item.description]);
    });
    console.log(table.toString());
  }
}

module.exports = Help;

