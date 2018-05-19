const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');

module.exports = (message, color) => {
  const { length } = message;
  let separator = '-';
  for (let i = 0; i < length + 1; i++) {
    separator += '-';
  }
  if (color === 'rainbow') {

    const anim = chalkAnimation.rainbow(`
${separator}
> ${message}
${separator}
`);
    anim.start();
    setTimeout(() => {
      anim.stop();
    }, 600);
    return;
  }
  console.log(chalk[color](`
${separator}
> ${message}
${separator}
`));
}