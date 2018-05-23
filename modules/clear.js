require('datejs');

const ListService = require('./../services/listService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');


class Clear {
  constructor() {
    this.render();
  }

  async render() {
    if (!ListService.isListCreated) {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
      return;
    }

    if (!ListService.getList().list.length) {
      Logger('Hmm, you your .todos list is empty!', 'red');
      return;
    }

    if (!ListService.getList().list.filter((item) => item.status === 'DONE').length) {
      Logger("Ugh, there are no items with status 'DONE' to clear in your .todos list!", 'magenta');
      return;
    }

    const { value: acceptance } = await PromptService.promptToggle({
      message: "Are you sure you want to clear list from 'DONE' .todos items?",
      initial: false,
      active: 'YES',
      inactive: 'NO',
    });

    if (acceptance) {
      ListService.updateList({
        ...ListService.getList(),
        list: [...ListService.getList().list.filter((item) => item.status !== 'DONE')],
      });
      ListService.sortList();
      Logger("OK! The .todos items with status 'DONE' was removed from your list!", 'rainbow');
    } else {
      Logger("Hmm... Don't waste my time!", 'magenta');
    }
  }
}


module.exports = Clear;
