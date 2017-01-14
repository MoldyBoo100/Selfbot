const chalk = require('chalk');
module.exports = client => {
	console.log(chalk.bgGreen.black(`Reconnecting at ${new Date()}`));
};
