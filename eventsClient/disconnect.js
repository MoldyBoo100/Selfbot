const chalk = require('chalk');
module.exports = client => {
	console.log(chalk.bgRed.black(`You have been disconnected at ${new Date()}`));
};
