require('datejs');

const ListService = require('./../services/listService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');
const UserService = require('./../services/userService');


class Add {
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

    const { value: name } = await PromptService.promptText({
      message: 'Name:',
      initial: `${ListService.itemNameRandom[Math.floor(Math.random() * 5)]}`,
    });

    const { value: timetable } = await PromptService.validatePrompt(
      () => PromptService.promptText({
        message: 'Timetable:',
        initial: 'null',
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

    const { value: priority } = await PromptService.promptSelect({
      message: 'Priority:',
      choices: [
        { title: '-', value: '-' },
        { title: '!', value: '!' },
        { title: '!!', value: '!!' },
        { title: '!!!', value: '!!!' },
      ],
      initial: 0,
    });

    const { list } = ListService.getList();

    if (ListService.isListCreated()) {
      ListService.updateList({
        ...ListService.getList(),
        list: [...list, {
          _id: ListService.getRandomString(),
          name,
          timetable,
          priority,
          status: ListService.status[0],
          author: UserService.username,
          updatedAt: now,
          createdAt: now,
        }],
      });
      ListService.sortList();
      Logger("Awesome! You've added .todos to the list!", 'rainbow');
    } else {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
    }
  }
}


module.exports = Add;
