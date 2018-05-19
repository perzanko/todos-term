const fs = require('fs');
const randomString = require('random-string');
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
    }
    this.itemNameRandom = [
      'Drink more water!',
      'Get back to coding',
      'Remember about the deadline...',
      'Buy eggs, rice and beer',
      'Write tests!',
    ]
    this.status = {
      0: 'TODO',
      1: 'IN PROGRESS',
      3: 'DONE',
    }
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
      message: `Name:`,
      initial: `${this.skeleton.meta.name}`,
    })

    const { value: description } = await PromptService.promptText({
      message: `Description:`,
      initial: `${this.skeleton.meta.description}`,
    })

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
      message: `Name:`,
      initial: `${this.itemNameRandom[Math.floor(Math.random() * 5)]}`,
    })

    const { value: timetable } = await PromptService.validatePrompt(
      () => PromptService.promptText({
        message: `Timetable:`,
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
      () => Logger(`The timetable entered is incorrect. Try to enter something else! (e.g. 'today at 16:00', 'tomorrow'...)`, 'red'),
      10);

    const { value: priority } = await PromptService.promptSelect({
      message: `Priority:`,
      choices: [
        { title: '-', value: '-', },
        { title: '!', value: '!', },
        { title: '!!', value: '!!', },
        { title: '!!!', value: '!!!', },
      ],
      initial: 0,
    })

    const { list } = this.getList();   

    if (this.isListCreated) {
      fs.writeFileSync(this.pathList, JSON.stringify({
        ...this.getList(),
        list: [ ...list, {
          _id: this.getRandomString(),
          name,
          timetable,
          priority,
          status: this.status[0],
          author: UserService.username,
          updatedAt: now,
          createdAt: now,
        }],
      }, null, 2));
      Logger(`Awesome! You've added .todos to the list!`, 'rainbow');
    } else {
      Logger('Ohh, you should create your .todos list first! (todos create)', 'red');
    }
  }


  getList() {
    return JSON.parse(fs.readFileSync(this.pathList));
  }


  getRandomString() {
    return randomString({
      length: 30,
      numeric: true,
      letters: true,
      special: false,
    })
  }
}


module.exports = new ListService();