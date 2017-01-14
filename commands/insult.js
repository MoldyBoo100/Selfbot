const insult = require('../bot_self_insults.js');
exports.run = function(client, message) {
	if (!message.mentions.users.first()) {
		message.edit('You need to @mention someone to insult them... idiot')
			.then(response => response.delete(1000).catch(error => console.log(error.stack)))
			.catch(error => console.log(error.stack));
	} else {
		message.edit(message.mentions.users.first() + ', You know what? You\'re nothing but ' +
			insult.start[
				Math.floor(Math.random() * insult.start.length)
			] + ' ' +
			insult.middle[
				Math.floor(Math.random() * insult.middle.length)
			] + ' ' +
			insult.end[
				Math.floor(Math.random() * insult.end.length)
			] + '.').catch(error => console.log(error.stack));
	}
};
