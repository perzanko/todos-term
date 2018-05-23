const fs = require('fs');
const os = require('os');
const randomString = require('random-string');
const chalk = require('chalk');
const moment = require('moment');
require('datejs');

const UserService = require('./userService');


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
    this.globalPathList = os.homedir() + '/.todos';
    this.global = false;
    console.log(os.homedir(), this.globalPathList);
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
    this.isListCreated = () => fs.existsSync(this.global ? this.globalPathList : this.pathList);
  }


  setGlobal(state) {
    this.global = state;
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
    fs.writeFileSync(this.global ? this.globalPathList : this.pathList, JSON.stringify(newObj, null, 2));
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
      list = JSON.parse(fs.readFileSync(this.global ? this.globalPathList : this.pathList));
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


  getIndexOfPriorityList(priority) {
    switch (priority) {
      case '-':
        return 0;
      case '!':
        return 1;
      case '!!':
        return 2;
      case '!!!':
        return 3;
      default:
        return 0;
    }
  }
}


module.exports = new ListService();
