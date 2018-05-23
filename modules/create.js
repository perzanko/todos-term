require('datejs');
const fs = require('fs');

const ListService = require('./../services/listService');
const UserService = require('./../services/userService');
const Logger = require('./../services/loggerService');
const PromptService = require('./../services/promptService');


class Create {
  constructor(isGlobal) {
    ListService.setGlobal(isGlobal);
    this.render(isGlobal);
  }

  async render(isGlobal) {
    const now = new Date();
    const newList = { ...ListService.skeleton };

    if (ListService.isListCreated()) {
      Logger('HOHO! .todos list already exists! You cannot create list twice!', 'red');
      return;
    }

    const { value: name } = await PromptService.promptText({
      message: 'Name:',
      initial: `${ListService.skeleton.meta.name}`,
    });

    const { value: description } = await PromptService.promptText({
      message: 'Description:',
      initial: `${ListService.skeleton.meta.description}`,
    });

    newList.meta.name = name;
    newList.meta.description = description;
    newList.meta.author = UserService.username;
    newList.meta.createdAt = now;
    newList.meta.updatedAt = now;
    newList.meta.members.push(UserService.username);

    if (!ListService.isListCreated()) {
      fs.writeFileSync(isGlobal ? ListService.globalPathList : ListService.pathList, JSON.stringify(newList, null, 2));
      Logger('Great! You have created .todos list! Now, you can add your first todo!', 'rainbow');
    } else {
      Logger('HOHO! .todos list already exists! You cannot create list twice!', 'red');
    }
  }
}


module.exports = Create;