const ListService = require('./../services/listService');


class Add {
  constructor() {
    this.init();
  }

  init() {
    ListService.addItem();
  }
}


module.exports = Add;