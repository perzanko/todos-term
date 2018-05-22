const PromptService = require('./promptService');

/**
 *
 * @class LoginService
 */
class LoginService {
  /**
   * Creates an instance of LoginService.
   * @memberof LoginService
   */
  constructor() {
    this.user = null;
    this.isLogged = false;
  }

  /**
   * Login
   *
   * @async
   * @memberof LoginService
   */
  async login() {
    const { value: username } = await PromptService.promptText({
      message: 'Username:',
    })
    const { value: password } = await PromptService.promptPass({
      message: 'Password:',
    })
    this.loginRequest(username, password);
  }


  async loginRequest(username, password) {
    console.log(username, password);
  }
}


module.exports = new LoginService();
