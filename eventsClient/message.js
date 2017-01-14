const settings = require('./settings.json');
const sql = require('sqlite');
module.exports = message => {
	const client = message.client;
	if (message.author.id !== client.user.id) return;
	// Mention Logger
	if (message.isMentioned(client.user.id)) {
		client.channels.get(settings.mentions).sendMessage(`You have a mention from **${message.author.username}**, from the _${message.channel}_ channel located on the _${message.guild}_ guild.\n\u200B`, {
			embed:{
				color: 3447003,
				author: {
					name: message.author.username,
					icon_url: message.author.avatarURL
				},
				description: `${message.cleanContent.replace('@', '')}`,
				timestamp: new Date(),
			}
		});
	}

	if (!message.content.startsWith('/')) return;

	// Lenny and friends stuff
	if (message.content.split(' ').length === 1) {
		sql.open('../selfbot.sqlite').catch(error=>console.log(error));
		sql.get('SELECT * FROM shortcuts WHERE name = ?', [message.content.slice(1)]).then(row => {
			if (!row) return;
			message.edit(row.contents);
		}).catch(error => console.log(error));
	}

	// Actual Commands.
	if (!message.content.startsWith(settings.prefix)) return;
	const args = message.content.split(' ');
	const command = args.shift().slice(settings.prefix.length);
	try {
		let cmdFile = require('../commands/' + command);
		cmdFile.run(client, message, args);
	} catch (e) {
		console.log(`Command ${command} failed\n ${e.stack}`);
	}
};
