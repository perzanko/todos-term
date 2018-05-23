require('datejs');
const chalk = require('chalk');
const moment = require('moment');

const ListService = require('./../services/listService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');


class Remove {
  constructor(isGlobal) {
    ListService.setGlobal(isGlobal);
    this.render();
  }

  async render() {
    const now = new Date();
    if (!ListService.isListCreated()) {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
      return;
    }

    if (!ListService.getList().list.length) {
      Logger('Hmm, you your .todos list is empty!', 'red');
      return;
    }

    const { value: idItemToRemove } = await PromptService.promptSelect({
      message: 'Choose an item:',
      choices: ListService.getList().list.map((item, index) => ({
        title: `${chalk.grey(index + 1 < 10 ? `${index + 1} ` : index + 1)}${chalk[ListService.gerColorStatus(item.status)](' • ')}${item.name}`,
        value: item._id,
      })),
      initial: 0,
    });

    const itemToRemove = ListService.getItemById(idItemToRemove);

    const { value: acceptance } = await PromptService.promptToggle({
      message: 'Are you sure you want to delete this item?',
      initial: false,
      active: 'YES',
      inactive: 'NO',
    });

    if (acceptance) {
      ListService.updateList({
        ...ListService.getList(),
        list: [...ListService.getListAfterRemovingItem(itemToRemove._id)],
      });
      ListService.sortList();
      Logger('OK! The .todos item was removed from the list!', 'rainbow');
    } else {
      Logger("Hmm... Don't waste my time!", 'magenta');
    }
  }
}


module.exports = Remove;
