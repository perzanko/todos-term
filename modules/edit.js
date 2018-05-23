require('datejs');
const chalk = require('chalk');
const moment = require('moment');

const ListService = require('./../services/listService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');


class Edit {
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

    const { value: idItemToEdit } = await PromptService.promptSelect({
      message: 'Choose an item:',
      choices: ListService.getList().list.map((item, index) => ({
        title: `${chalk.grey(index + 1 < 10 ? `${index + 1} ` : index + 1)}${chalk[ListService.gerColorStatus(item.status)](' • ')}${item.name}`,
        value: item._id,
      })),
      initial: 0,
    });

    const itemToEdit = ListService.getItemById(idItemToEdit);

    const { value: newName } = await PromptService.promptText({
      message: 'Name:',
      initial: itemToEdit.name,
    });
    const { value: newTimetable } = await PromptService.validatePrompt(
      () => PromptService.promptText({
        message: 'Timetable:',
        initial: itemToEdit.timetable !== 'null' ? moment(itemToEdit.timetable).calendar() : 'null',
        format: (e) => {
          const date = Date.parse(e) ? Date.parse(e) : false;
          return e === null || e === 'null' ? 'null' : date;
        },
      }),
      (val) => {
        if (val === 'null') return true;
        return Date.parse(val) ? true : false;
      },
      () => Logger("The timetable entered is incorrect. Try to enter something else! (e.g. 'today at 16:00', 'tomorrow'...)", 'red'),
      10
    );
    const { value: newPriority } = await PromptService.promptSelect({
      message: 'Priority:',
      choices: [
        { title: '-', value: '-' },
        { title: '!', value: '!' },
        { title: '!!', value: '!!' },
        { title: '!!!', value: '!!!' },
      ],
      initial: ListService.getIndexOfPriorityList(itemToEdit.priority),
    });

    if (ListService.isListCreated()) {
      ListService.updateList({
        ...ListService.getList(),
        list: [...ListService.getListAfterRemovingItem(itemToEdit._id), {
          ...itemToEdit,
          name: newName,
          timetable: newTimetable,
          priority: newPriority,
          updatedAt: now,
        }],
      });
      ListService.sortList();
      Logger("Awesome! You've edited .todos item!", 'rainbow');
    } else {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
    }
  }
}


module.exports = Edit;
