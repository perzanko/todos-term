const fs = require('fs');
const randomString = require('random-string');
const chalk = require('chalk');
require('datejs');

const UserService = require('./userService');
const Logger = require('./loggerService');
const PromptService = require('./promptService');


/**
 * List service provides method to creating, adding and managing list.
 *
 * @class ListService
 */
class ListService {
  /**
   * Creates an instance of ListService.
   * @memberof ListService
   */
  constructor() {
    this.pathList = './.todos';
    this.skeleton = {
      meta: {
        name: 'My awesome .todos',
        description: `.todos created by ${UserService.username && UserService.username !== 'unknown' ? UserService.username : 'me'}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        author: '',
        members: [],
      },
      list: [],
    };
    this.itemNameRandom = [
      'Drink more water!',
      'Get back to coding',
      'Remember about the deadline...',
      'Buy eggs, rice and beer',
      'Write tests!',
    ];
    this.status = {
      0: 'TODO',
      1: 'IN PROGRESS',
      2: 'DONE',
    };
    this.isListCreated = fs.existsSync(this.pathList);
  }


  /**
   * Create list method. If there is list, return alert.
   *
   * @memberof ListService
   */
  async create() {
    const now = new Date();
    const newList = { ...this.skeleton };

    if (this.isListCreated) {
      Logger('HOHO! .todos list already exists! You cannot create list twice!', 'red');
      return;
    }

    const { value: name } = await PromptService.promptText({
      message: 'Name:',
      initial: `${this.skeleton.meta.name}`,
    });

    const { value: description } = await PromptService.promptText({
      message: 'Description:',
      initial: `${this.skeleton.meta.description}`,
    });

    newList.meta.name = name;
    newList.meta.description = description;
    newList.meta.author = UserService.username;
    newList.meta.createdAt = now;
    newList.meta.updatedAt = now;
    newList.meta.members.push(UserService.username);

    if (!this.isListCreated) {
      fs.writeFileSync(this.pathList, JSON.stringify(newList, null, 2));
      Logger('Great! You have created .todos list! Now, you can add your first todo!', 'rainbow');
    } else {
      Logger('HOHO! .todos list already exists! You cannot create list twice!', 'red');
    }
  }


  /**
   * Add item method. This method adds item to the list.
   *
   * @memberof ListService
   */
  async addItem() {
    const now = new Date();
    if (!this.isListCreated) {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
      return;
    }

    const { value: name } = await PromptService.promptText({
      message: 'Name:',
      initial: `${this.itemNameRandom[Math.floor(Math.random() * 5)]}`,
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

    const { list } = this.getList();

    if (this.isListCreated) {
      this.updateList({
        ...this.getList(),
        list: [...list, {
          _id: this.getRandomString(),
          name,
          timetable,
          priority,
          status: this.status[0],
          author: UserService.username,
          updatedAt: now,
          createdAt: now,
        }],
      });
      this.sortList();
      Logger("Awesome! You've added .todos to the list!", 'rainbow');
    } else {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
    }
  }


  /**
   * Change item status.
   * render prompt and save in json.
   *
   * @memberof ListService
   */
  async changeItemStatus() {
    const now = new Date();
    const { list } = this.getList();

    if (!this.isListCreated) {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
      return;
    }
    if (!list.length) {
      Logger('Hmm, you must first add an element to the .todos list! (todos add)', 'red');
      return;
    }

    const { value: listItem } = await PromptService.promptSelect({
      message: 'Item to status change:',
      choices: list.map((item, index) => ({
        title: `${chalk.grey(index + 1 < 10 ? `${index + 1} ` : index + 1)}${chalk[this.gerColorStatus(item.status)](' • ')}${item.name}`,
        value: item._id,
      })),
      initial: 0,
    });

    const { value: status } = await PromptService.promptSelect({
      message: 'Item to status change:',
      choices: [1, 2, 3].map((item, index) => ({
        title: chalk[this.gerColorStatus(this.status[index])]('• ') + this.status[index],
        value: this.status[index],
      })),
      initial: 0,
    });

    this.updateList({
      ...this.getList(),
      list: [
        ...this.getListAfterRemovingItem(listItem),
        {
          ...this.getItemById(listItem),
          status,
          updatedAt: now,
        },
      ],
    });
    this.sortList();
    Logger(`Awesome! You've changed status of this .todos element to '${status}'`, 'rainbow');
  }


  /**
   * Sort json list by date and priority
   *
   * @param {object} [{ meta, list }=this.getList()]
   * @memberof ListService
   */
  sortList({ meta, list } = this.getList()) {
    const sortedList = list
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          if (a.priority === '-') return 1;
          if (b.priority === '-') return -1;
          return (b.priority.length - a.priority.length);
        }
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      });
    this.updateList({
      meta,
      list: sortedList,
    });
  }


  /**
   * Update list and save as json .todos
   *
   * @param {object} obj
   * @memberof ListService
   */
  updateList(obj) {
    const newObj = obj;
    newObj.meta.updatedAt = new Date();
    fs.writeFileSync(this.pathList, JSON.stringify(newObj, null, 2));
    this.memoizeList = newObj;
  }


  /**
   * Get list using memoize mechanism.
   *
   * @returns {object}
   * @memberof ListService
   */
  getList() {
    let list = null;
    if (this.memoizeList) {
      list = { ...this.memoizeList };
    } else {
      list = JSON.parse(fs.readFileSync(this.pathList));
    }
    this.memoizeList = list;
    return list;
  }


  /**
   * Get element by given id.
   *
   * @param {string} id
   * @returns {object/null}
   * @memberof ListService
   */
  getItemById(id) {
    const { list } = this.getList();
    return list.find((item) => item._id === id);
  }


  /**
   * Get list object and remove item from the list.
   *
   * @param {string} id
   * @returns {array}
   * @memberof ListService
   */
  getListAfterRemovingItem(id) {
    const { list } = this.getList();
    let index = '';
    list.forEach((item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    return list.filter((item, ind) => ind !== index);
  }


  /**
   * generate random string
   *
   * @returns {string}
   * @memberof ListService
   */
  getRandomString() {
    return randomString({
      length: 30,
      numeric: true,
      letters: true,
      special: false,
    });
  }


  /**
   * Helper method to status colors.
   *
   * @param {string} status
   * @returns {string}
   * @memberof ListService
   */
  gerColorStatus(status) {
    const statusColors = {};
    statusColors[this.status[2]] = 'green';
    statusColors[this.status[1]] = 'yellow';
    statusColors[this.status[0]] = 'red';
    return status ? statusColors[status] : 'grey';
  }
}


module.exports = new ListService();
