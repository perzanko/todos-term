const ListService = require('./../services/listService');


class Create {
  constructor() {
    this.init();
  }

  init() {
    ListService.create();
  }
}


module.exports = Create;