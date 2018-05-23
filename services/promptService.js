const repeat = require('repeat-string');
const prompts = require('prompts');

/**
 * Prompt service
 * 
 * @class promptService
 */
class PromptService {
  /**
   * Handle common, text input.
   *
   * @static
   * @memberof promptService
   */
  static promptText({ ...args }) {
    return prompts({
      type: 'text',
      name: 'value',
      ...args,
    }, {
      onCancel: () => process.exit(),
    })
  }


  /**
   * Handle common, text input.
   *
   * @static
   * @memberof promptService
   */
  static promptSelect(options) {
    return prompts({
      type: 'select',
      name: 'value',
      ...options,
    }, {
      onCancel: () => process.exit(),
    });
  }


  static promptToggle(options) {
    return prompts({
      type: 'toggle',
      name: 'value',
      ...options,
    }, {
      onCancel: () => process.exit(),
    });
  }


  /**
   * Handle password input
   * 
   * @static
   * @memberof promptService
   */
  static promptPass(options) {
    return prompts({
      type: 'text',
      style: 'password',
      name: 'value',
      ...options,
    }, {
      onCancel: () => process.exit(),
    })
  }

  static validatePrompt(
    prompt,
    isValid,
    onError = () => console.log('The value entered is incorrect!'),
    count = 10
  ) {
    return new Promise(async (res) => {
      for (let i = 0; i < count; i++) {
        const response = await prompt();
        if (isValid(response.value)) {
          res(response);
          break;
        } else {
          onError();
        }
        if (i === count - 1) {
          process.exit();
        }
      }
    })
  }
}

module.exports = PromptService;