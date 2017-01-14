const moment = require('moment');
require('moment-duration-format');
exports.run = function(client, message) {
	let pack = require('../package.json');
	let embed = {
		color: 0xFF9900,
		description: '**Selfbot Statistics**\n',
		fields: [{
			name: '❯ Uptime',
			value: moment.duration(client.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'),
			inline: false
		}, {
			name: '❯ Launched',
			value: `${client.date} @ ${client.time}`,
			inline: true
		}, {
			name: '❯ Memory usage',
			value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
			inline: true
		}, {
			name: '❯ Version',
			value: pack.version,
			inline: true
		}, {
			name: '❯ Installed Packages',
			value: '\u200B',
			inline: false
		}],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL, // eslint-disable-line camelcase
			text: 'Statistics'
		}
	};
	for (key in pack.dependencies) {
		embed.fields.push({
			name: `**${key}**`,
			value: pack.dependencies[key].replace('^', '').replace('github:hydrabolt/discord.js#', ''),
			inline: true
		});
	}
	embed.fields.push({
		name: '❯ Source Code',
		value: '[GitHub](https://github.com/YorkAARGH/Selfbot)'
	}, {
		name: '\u200B',
		value: '\u200B'
	});
	message.edit('', {
		embed
	}).catch(error => console.log(error));
};
