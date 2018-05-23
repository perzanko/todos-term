require('datejs');
const chalk = require('chalk');

const ListService = require('./../services/listService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');


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
  constructor(isGlobal) {
    ListService.setGlobal(isGlobal);
    this.render();
  }


  /**
   * Render prompt form
   *
   * @memberof Status
   */
  async render() {
    const now = new Date();

    if (!ListService.isListCreated()) {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
      return;
    }
    const { list } = ListService.getList();
    if (!list.length) {
      Logger('Hmm, you must first add an element to the .todos list! (todos add)', 'red');
      return;
    }

    const { value: listItem } = await PromptService.promptSelect({
      message: 'Item to status change:',
      choices: list.map((item, index) => ({
        title: `${chalk.grey(index + 1 < 10 ? `${index + 1} ` : index + 1)}${chalk[ListService.gerColorStatus(item.status)](' • ')}${item.name}`,
        value: item._id,
      })),
      initial: 0,
    });

    const { value: status } = await PromptService.promptSelect({
      message: 'Item to status change:',
      choices: [1, 2, 3].map((item, index) => ({
        title: chalk[ListService.gerColorStatus(ListService.status[index])]('• ') + ListService.status[index],
        value: ListService.status[index],
      })),
      initial: 0,
    });

    ListService.updateList({
      ...ListService.getList(),
      list: [
        ...ListService.getListAfterRemovingItem(listItem),
        {
          ...ListService.getItemById(listItem),
          status,
          updatedAt: now,
        },
      ],
    });
    ListService.sortList();
    Logger(`Awesome! You've changed status of this .todos element to '${status}'`, 'rainbow');
  }
}


module.exports = Status;
