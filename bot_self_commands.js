const bot = require('./bot_self.js');
const insult = require('./bot_self_insults.js');
const util = require('util');
const fse = require('fs-promise');
const sql = require('sqlite');
const moment = require('moment');
require('moment-duration-format');
const request = require('superagent');
var HTMLParser = require('fast-html-parser');
var settings = require('./settings.json');
var pack = require('./package.json');
const exec = require('child_process').exec;

const Pad = (str, l) => {
	return str + Array(l - str.length + 1).join(' ');
};

const aliases = {
	'p': 'ping',
	'r': 'reload',
	'h': 'help',
	't': 'tag',
	'n': 'todo',
	'tl': 'taglist',
	'at': 'addtag',
	'dt': 'deltag',
	'as': 'addslash',
	'ds': 'delslash',
	'sl': 'slashes',
	'ev': 'eval',
	'pu': 'purge',
	'pr': 'prune',
	're': 'reply',
	'rld': 'reload',
	'bbl': 'afk',
	'brb': 'afk',
	'tags': 'taglist',
	'away': 'afk',
	'gone': 'sleep',
	'bell': 'shame',
	'note': 'todo',
	'stats': 'info',
	'slash': 'slashes'
};

var commands = {

	// cmdname: {
	// 	name: '',
	// 	description: '',
	// 	usage: '',
	// 	alias: '',
	// 	execute: function(client, message){
	//
	// 	}
	// },

	reply: {
		name: 'Reply',
		description: 'This quotes the message supplied via message ID',
		usage: 'reply <messageId> <response>',
		alias: 're',
		execute: function(client, message, args) {
			const [replyTo, ...replyText] = args;
			message.channel.fetchMessages({
				limit: 1,
				around: replyTo
			})
				.then(messages => {
					const replyToMsg = messages.first();
					message.channel.sendMessage(`${replyToMsg.author}, ${replyText.join(' ')}`, {
						embed: {
							color: 0xC274FF,
							author: {
								name: `${replyToMsg.author.username} (${replyToMsg.author.id})`,
								icon_url: replyToMsg.author.avatarURL
							},
							description: replyToMsg.content
						}
					}).then(() => message.delete());
				}).catch(console.error);
		}
	},

	selfie: {
		name: 'Selfie',
		description: 'Smile! This takes a picture from the webcam attached to the pi',
		usage: '',
		alias: '',
		execute: function(client, message, args) {
			message.delete();
			exec('fswebcam --fps 15 -S 8 -r 400x225 --no-banner selfie.jpg', (error) => {
				// callback runs when the command is done!
				if (error) return;
				const image = fse.readFileSync('selfie.jpg');
				client.channels.get(message.channel.id).sendFile(image, 'selfie.jpg', args.join(' '));
			});
		}
	},

	idiotsguide: {
		name: 'An Idiot\'s Guide',
		description: 'A quick promotional embed of an Idiot\'s Guide',
		usage: '',
		alias: '',
		execute: function(client, message){
			let embed = {
				color: 0xdd2825,
				description: 'Introducing a basic how to guide on creating and running a discord.js bot, _"An Idiot\'s Guide"_ is catered to the fresh faced discord bot developers, a new video every week(ish) but be-warned, I like to curse like a sailor, so it’s NSFW-ish and is recommended for the mature viewer.',
				fields: [{
					name: '❯ Channel Link',
					value: '[An Idiot\'s Guide](https://www.youtube.com/channel/UCLun-hgcYUgNvCCj4sIa-jA)',
					inline: true
				}, {
					name: '❯ Subscribe',
					value: '[Click Here](https://www.youtube.com/channel/UCLun-hgcYUgNvCCj4sIa-jA?sub_confirmation=1)',
					inline: true
				}, {
					name: '\u200B',
					value: '\u200B',
					inline: true
				}, {
					name: '❯ Episode 1',
					value: '[Getting Started](https://www.youtube.com/watch?v=rVfjZrqoQ7o)',
					inline: true
				}, {
					name: '❯ Episode 2',
					value: '[Multiple Commands](https://www.youtube.com/watch?v=8AiZBdcPKOM)',
					inline: true
				}, {
					name: '❯ Episode 3',
					value: '[Guild Events](https://www.youtube.com/watch?v=oDJrtA1YORw)',
					inline: true
				}, {
					name: '❯ Episode 4',
					value: '[Client Events](https://www.youtube.com/watch?v=KKmyTfGbY54)',
					inline: true
				}, {
					name: '❯ Episode 5',
					value: '[Roles](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
					inline: true
				}, {
					name: '❯ Episode 6',
					value: '[Handling](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
					inline: true
				}, {
					name: '❯ Playlists',
					value: '\u200B'
				}, {
					name: 'Discord.js',
					value: '[Watch Now](https://www.youtube.com/playlist?list=PLR2_rarYLHfg6ZJqq0WTMmI9uLcd7_GRO)',
					inline: true
				}, {
					name: 'Hosting',
					value: '[Watch Now](https://www.youtube.com/playlist?list=PLR2_rarYLHfjr6tzXXSFO0o326dQlnxUB)',
					inline: true
				}, {
					name: '\u200B',
					value: '\u200B',
					inline: true
				}, {
					name: '\u200B',
					value: '\u200B'
				}],
				footer: {
					icon_url: client.user.avatarURL, // eslint-disable-line camelcase
					text: 'An Idiot\'s Guide'
				}
			};
			message.delete().then(message.channel.sendMessage('', {embed}));
		}
	},

	fml: {
		name: 'Fuck my life',
		description: 'Quotes from fmylife.com',
		usage: '',
		alias: '',
		execute: function(client, message) {
			request
				.get('http://www.fmylife.com/random')
				.end((err, res) => {
					if (err) return message.reply(err);
					let root = HTMLParser.parse(res.text);
					let article = root.querySelector('.post.article .fmllink');
					message.edit(article.childNodes[0].text).catch(error => console.log(error.stack));
				});
		}
	},

	spy: {
		name: 'spy',
		description: '',
		usage: '',
		alias: '',
		execute: function(client, message, args) {
			console.log('Args: ' + args.join(' '));
			var fetchUser = client.users.find('username', args.join(' ')).catch(error => console.log(error.stack));
			console.log('fetchUser: ' + fetchUser);
			let ui_name = client.guilds.get(message.guild.id).members.get(fetchUser.id).catch(error => console.log(error.stack));
			console.log(ui_name);
			let spymsg = [
				'USER INFO',
				`User ID			: ${ui_name.user.id}`,
				`Nickname		 : ${ui_name.nickname}`,
				`Username		 : ${ui_name.user.username}`,
				`Discrim		: ${ui_name.user.discriminator}`,
				`Bot					: ${ui_name.user.bot}`,
				`Joined			 : ${ui_name.joinedTimestamp}`,
			];
			message.delete().catch(error => console.log(error.stack));
			message.channel.sendCode('LDIF', spymsg).catch(error => console.log(error.stack));
		}
	},

	ping: {
		name: 'Ping',
		description: 'This is a standard response command.',
		usage: '',
		alias: 'p',
		execute: function(client, message) {
			message.edit(`Pong! \`${new Date().getTime() - message.createdTimestamp}\` ms`).then(m => m.delete(10000)).catch(error => console.log(error.stack));
		}
	},

	help: {
		name: 'Help',
		description: 'This will bring up information about the commands you want help with.',
		usage: settings.prefix + 'help <command>',
		alias: 'h',
		execute: function(client, message, args) {
			let sendhelp = [];
			let command = args[0];
			if (command) {
				if (commands.hasOwnProperty(command)) {
					sendhelp.push('\`\`\`LDIF');
					sendhelp.push(`Name: ${commands[command].name}`);
					if (commands[command].alias) {
						sendhelp.push(`Alias: ${commands[command].alias}`);
					}
					sendhelp.push(`Description: ${commands[command].description}`);
					if (commands[command].usage) {
						sendhelp.push(`Usage: ${commands[command].usage}`);
					}
					if (commands[command].permissions) {
						sendhelp.push(`Permissions: ${commands[command].permissions}`);
					}
					sendhelp.push('\`\`\`');
					message.edit(sendhelp).then(m => m.delete(10000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack));
				}
			} else {
				let toSend = '';
				let i = 0;
				let sortedKeys = Object.keys(commands);
				sortedKeys.sort();
				for (let key in sortedKeys) {
					if ((i % 3) == 0) {
						toSend += `\n${Pad(toTitleCase(sortedKeys[key]), 12)}`;
					} else {
						toSend += `${Pad(toTitleCase(sortedKeys[key]), 12)}`;
					}
					i++;
				}
				message.edit(`\`\`\`LDIF\nThis is a list of commands available to you, to get more info just do ${settings.prefix}help <command>\n ${toSend} \n\`\`\``).then(m => m.delete(10000).catch(error => console.log(error.stack)))
					.catch(error => console.log(error.stack));
			}
		}
	},

	pin: {
		name: 'Pin',
		description: 'This emulates the pin message functionality native to discord.',
		usage: settings.prefix + 'pin <message ID>, <last> or <mention last>',
		alias: '',
		execute: function(client, message, args) {
			const notes = settings.pinchannel;

			if (isNaN(args[0]) && args[0] === ('last')) {
				message.channel.fetchMessages({
					limit: 100,
					before: message.id
				}).then(messages => {
					let message_array = messages.array();
					let lastresult = `:pushpin: ${message_array[0].content} - ${moment(message_array[0].timestamp).format('D[/]M[/]Y [@] HH:mm:ss')} by **${message_array[0].author.username}** in #${message_array[0].channel.name}`;

					client.channels.get(notes).sendMessage(lastresult).then(() =>
						message.edit('Pin added successfully').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack))
					).catch(() => {
						message.edit('Could not find message!').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack));
					});
				}).catch(error => console.log(error.stack));
			} else

			if (message.mentions.users && args[1] === ('last')) {
				message.channel.fetchMessages({
					limit: 100
				}).then(messages => {
					let message_array = messages.array();
					message_array = message_array.filter(m => m.author.id === message.mentions.users.array()[0].id);
					let lastresult = `:pushpin: ${message_array[0].content} - ${moment(message_array[0].timestamp).format('D[/]M[/]Y [@] HH:mm:ss')} by **${message_array[0].author.username}** in #${message_array[0].channel.name}`;
					client.channels.get(notes).sendMessage(lastresult).then(() =>
						message.edit('Pin added successfully').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack))
					).catch(() => {
						message.edit('Could not find message!').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack));
					});
				}).catch(error => console.log(error.stack));
			} else {
				message.channel.fetchMessages({
					around: args[0]
				}).then(messages => {
					let result = messages.filter(e => e.id == args[0]).first();
					let final = `:pushpin: ${result.content} - ${moment(result.timestamp).format('D[/]M[/]Y [@] HH:mm:ss')} by **${result.author.username}** in #${result.channel.name}`;
					client.channels.get(notes).sendMessage(final).then(() =>
						message.edit('Pin added successfully').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack))
					).catch(() => {
						message.edit('Could not find message!').then(m => m.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack));
					});
				}).catch(error => console.log(error.stack));


			}
		}
	},

	afk: {
		name: 'AFK',
		description: 'Appends [is AFK] to the nickname',
		usage: '',
		alias: 'brb, away, bbl',
		permissions: ['CHANGE_NICKNAME'],
		execute: function(client, message) {
			let nickname = message.guild.member(client.user).nickname;
			let username = message.guild.member(client.user).user.username;
			if (!nickname) {
				message.guild.member(client.user).setNickname(username + ' [is AFK]').then(() => {
					message.edit('Set to away from keyboard').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else

			if (nickname.search(' [is AFK]')) {
				message.guild.member(client.user).setNickname('').then(() => {
					message.edit('No longer AFK').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else

			if (nickname && !nickname.includes(' [is AFK]')) {
				message.guild.member(client.user).setNickname(nickname + ' [is AFK]').then(() => {
					message.edit('Set to Away From Keyboard').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else if (nickname.search(' [is AFK]')) {
				message.guild.member(client.user).setNickname(nickname.replace(/ \[AFK\]/g, '')).then(() => {
					message.edit('No longer AFK').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			}
		}
	},

	sleep: {
		name: 'Sleep',
		description: 'Appends [is sleeping] to the nickname',
		usage: '',
		alias: 'gone',
		permissions: ['CHANGE_NICKNAME'],
		execute: function(client, message) {
			let nickname = message.guild.member(client.user).nickname;
			let username = message.guild.member(client.user).user.username;
			if (!nickname) {
				message.guild.member(client.user).setNickname(username + ' [is sleeping]').then(() => {
					message.edit('Set to sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else

			if (nickname.search(' [is sleeping]')) {
				message.guild.member(client.user).setNickname('').then(() => {
					message.edit('No longer sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else

			if (nickname && !nickname.includes(' [is sleeping]')) {
				message.guild.member(client.user).setNickname(nickname + ' [is sleeping]').then(() => {
					message.edit('Set to sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			} else if (nickname.search(' [is sleeping]')) {
				message.guild.member(client.user).setNickname(nickname.replace(/ \[is sleeping\]/g, '')).then(() => {
					message.edit('No longer sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
				}).catch(error => console.log(error.stack));
			}
		}
	},

	info: {
		name: 'Information',
		description: 'Displays information such as memory usage, how long it has been running for, size of guilds/members/channels and when it launched.',
		usage: '',
		alias: 'stats',
		execute: function(client, message) {
			let deps = require('./package.json').dependencies;
			let embed = {
				color: 0xFF9900,
				description: '**Selfbot Statistics**\n',
				fields: [{
					name: '❯ Uptime',
					value: moment.duration(client.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'),
					inline: false
				}, {
					name: '❯ Launched',
					value: `${bot.date} @ ${bot.time}`,
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
			for (key in deps) {
				embed.fields.push({
					name: `**${key}**`,
					value: deps[key].replace('^', '').replace('github:hydrabolt/discord.js#', ''),
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
			//message.edit(infomsg).then(m => m.delete(10000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack));
		}
	},

	insult: {
		name: 'Insult',
		description: 'One of the worlds best features, a truly random insult generator.',
		usage: settings.prefix + 'insult <mention>',
		alias: '',
		execute: function(client, message) {
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
		}
	},

	reload: {
		name: 'Reload',
		description: 'This reloads all of the commands without having to reboot the bot.',
		usage: '',
		alias: 'r, rld',
		execute: function(client, message) {
			bot.reload(message);
		}
	},

	setgame: {
		name: 'Set Game',
		description: 'Sets the bots game',
		usage: settings.prefix + 'setgame <game>',
		alias: '',
		execute: function(client, message, args) {
			let result = args.join(' ');
			if (!result) {
				result = null;
			}
			client.user.setGame(result).then(() => {
				let text = result ? 'Game changed to ' + result : 'Game Cleared';
				message.edit(text).then(response => response.delete(1000).catch(error => console.log(error.stack)));
			}).catch(error => console.log(error.stack));
		}
	},

	setnick: {
		name: 'Set Nick',
		description: 'Applies or clears a nickname',
		usage: settings.prefix + 'setnick <nickname>',
		alias: '',
		permissions: ['CHANGE_NICKNAME'],
		execute: function(client, message, args) {
			message.guild.member(client.user).setNickname(args.join(' ')).then(() => {
				let text = args.join(' ') ? 'Nickname changed to ' + args.join(' ') : 'Nickname Cleared';
				message.edit(text).then(response => response.delete(1000).catch(error => console.log(error.stack)));
			}).catch(error => console.log(error.stack));

		}
	},

	setprefix: {
		name: 'Set Prefix',
		description: 'Changes the command prefix',
		usage: settings.prefix + 'setprefix <new prefix>',
		alias: '',
		execute: function(client, message, args) {
			//set prefix
			var settingsFile = require('./settings.json'); //or whatever local path
			settingsFile.prefix = args[0];
			//save changes to json
			fse.writeFileSync('settings.json', JSON.stringify(settingsFile, null, '\t')).catch(error => console.log(error.stack));
			settingsFile = require('./settings.json'); // reload it from file again because you weren't actually having it update with the changed values
			//reload the command file
			bot.reload(message);
			//give feedback
			message.edit('Prefix set to: ' + settingsFile.prefix)
				.then(response => response.delete(1000).catch(error => console.log(error.stack)))
				.catch(error => console.log(error.stack));
			settingsFile = null;
		}
	},

	todo: {
		name: 'TODO',
		description: 'Posts a TODO message in a predefined channel',
		usage: settings.prefix + 'todo <note>',
		alias: 'note, n',
		execute: function(client, message, args) {
			let note = args.join(' ');
			client.channels.get(settings.notchannel).sendMessage('***TODO: ***' + note)
				.then(message.edit('Posted successfully.')
					.then(message.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack)))
				.catch(error => console.log(error.stack));
		}
	},

	shame: {
		name: 'Shame Bell',
		description: 'Based on the Shame bell from Game Of Thrones, this command will tag a user and shame them with bells',
		usage: settings.prefix + 'shame <mention>',
		alias: 'bell',
		execute: function(client, message) {
			if (!message.mentions.users.first()) {
				message.edit('You need to @mention someone to shame them')
					.then(response => response.delete(1000).catch(error => console.log(error.stack)))
					.catch(error => console.log(error.stack));
			} else {
				message.edit('SHAME :bell: ' + message.mentions.users.first() + ' :bell: SHAME')
					.catch(error => console.log(error.stack));
			}
		}
	},

	prune: {
		name: 'Prune',
		description: 'This will clear the quantity of messages that you specified',
		usage: settings.prefix + 'prune <quantity>',
		alias: 'pr',
		execute: function(client, message, args) {
			let messagecount = parseInt(args) ? parseInt(args[0]) : 1;
			message.channel.fetchMessages({
					limit: 100
				})
				.then(messages => {
					let msg_array = messages.array();
					msg_array = msg_array.filter(m => m.author.id === client.user.id);
					msg_array.length = messagecount + 1;
					msg_array.map(m => m.delete()
						.catch(error => console.log(error.stack)));
				});
		}
	},

	purge: {
		name: 'Purge',
		description: 'This is the bigger and meaner sibling of prune, this will delete any messages within the quantity you specified.',
		usage: settings.prefix + 'purge <quantity>',
		alias: 'pu',
		permissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
		execute: function(client, message, args) {
			let messagecount = parseInt(args);
			message.channel.fetchMessages({
					limit: messagecount + 1
				})
				.then(messages => {
					messages.map(m => m.delete()
						.catch(error => console.log(error.stack)));
				});
		}
	},

	eval: {
		name: 'Eval',
		description: 'Evaluate and execute JavaScript code and expressions, very powerful be careful when using this',
		usage: '',
		alias: 'ev',
		execute: function(client, message) {
			let suffix = message.content.slice(6);

			try {
				let evaled = eval(suffix);
				let type = typeof evaled;
				let insp = util.inspect(evaled, {
					depth: 0
				});
				let tosend = [];

				if (evaled === null) evaled = 'null';

				tosend.push('**EVAL:**');
				tosend.push('\`\`\`js');
				tosend.push(clean(suffix));
				tosend.push('\`\`\`');
				tosend.push('**Evaluates to:**');
				tosend.push('\`\`\`LDIF');
				tosend.push(clean(evaled.toString().replace(bot.token, 'Redacted').replace(client.user.email, 'Redacted')));
				tosend.push('\`\`\`');
				if (evaled instanceof Object) {
					tosend.push('**Inspect:**');
					tosend.push('\`\`\`js');
					tosend.push(insp.toString().replace(bot.token, 'Redacted').replace(client.user.email, 'Redacted'));
					tosend.push('\`\`\`');
				} else {
					tosend.push('**Type:**');
					tosend.push('\`\`\`js');
					tosend.push(type);
					tosend.push('\`\`\`');
				}
				message.edit(tosend);
			} catch (err) {
				let tosend = [];
				tosend.push('**EVAL:** \`\`\`js');
				tosend.push(clean(suffix));
				tosend.push('\`\`\`');
				tosend.push('**Error:** \`\`\`LDIF');
				tosend.push(clean(err.message));
				tosend.push('\`\`\`');
				message.edit(tosend)
					.catch(error => console.log(error.stack));
			}
		}
	},

	reboot: {
		name: 'Reboot',
		description: 'This will make your bot exit cleanly, and if you are using PM2, Forver or a similar module, it will restart it.',
		usage: '',
		alias: '',
		execute: function(client, message) {
			message.edit('Rebooting...').then(() => {
				process.exit();
			}).catch(error => console.log(error.stack));
		}
	},



	addtag: {
		name: 'Add Tags',
		description: 'This will add a tag (Kinda like a custom emote) to the database, and it supports multiple lines as well!',
		usage: settings.prefix + 'addtag <name> <contents>',
		alias: 'at',
		execute: function(client, message, args) {
			let name = args[0];
			let contents = args.slice(1).join(' ');
			sql.open('./selfbot.sqlite').then(() => sql.get(`SELECT * FROM tags WHERE name = '${name}'`)).then(row => {
				if (!row) {
					sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [name, contents]).then(() => {
						message.edit('Tag (' + name + ') was added').then(response => {
							response.delete(5000);
						});
					}).catch(error => client.winston.log('error', error.stack));
				} else {
					message.edit('Duplicate Tag (' + name + ') found.').then(response => {
						response.delete(5000);
					}).catch(error => client.winston.log('error', error.stack));
				}
			}).catch(error => client.winston.log('error', error.stack));
		}
	},

	tag: {
		name: 'Tag',
		description: 'This is how you use the tags you create.',
		usage: settings.prefix + 'tag <tag name>',
		alias: 't',
		execute: function(client, message, args) {
			sql.open('./selfbot.sqlite').then(() => sql.get('SELECT * FROM tags WHERE name = ?', args[0])).then(row => {
				if (row) {
					let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
					message.edit(message_content);
				} else {
					message.edit(`Could not find tag (${args[0]}).`).then(response => {
						response.delete(5000);
					});
				}
			}).catch(error => client.winston.log('error', error.stack));
		}
	},

	deltag: {
		name: 'Delete Tag',
		description: 'If you want to remove a tag this is the command for you!',
		usage: settings.prefix + 'deltag <tag name>',
		alias: 'dt',
		execute: function(client, message, args) {
			sql.open('./selfbot.sqlite').then(() => {
				sql.run('DELETE FROM tags WHERE name = ?', args[0])
					.then(() => {
						message.edit('The tag (' + args[0] + ') has been deleted').then(response => {
							response.delete(5000);
						});
					})
					.catch(error => client.winston.log('error', error.stack));
			});
		}
	},

	taglist: {
		name: 'List Tags',
		description: 'Use this if you want to display all the tags you have stored.',
		usage: settings.prefix + 'taglist',
		alias: 'tags, tl',
		execute: function(client, message) {
			sql.open('./selfbot.sqlite').then(() => sql.all('SELECT * FROM tags')).then(rows => {
				message.edit('Tags: ' + rows.map(r => r.name).join(', ')).then(response =>
					response.delete(15000)
				);
			}).catch(error => client.winston.log('error', error.stack));
		}
	},

	addslash: {
		name: 'Add Slash',
		description: 'This will add a new "slash" command, like /shrug on the discord PC client, it supports multiple lines as well!',
		usage: settings.prefix + 'addslash <name> <contents>',
		alias: 'as',
		execute: function(client, message, args) {
			var name = args[0];
			var contents = args.slice(1).join(' ');
			sql.open('./selfbot.sqlite').then(() => sql.get(`SELECT * FROM shortcuts WHERE name = '${name}'`)).then(
				row => {
					if (!row) {
						sql.run('INSERT INTO shortcuts (name, contents) VALUES (?, ?)', [name, contents]).then(() => {
							message.edit('Slash (' + name + ') was added').then(response => {
								response.delete(5000);
							});
						}).catch(error => client.winston.log('error', error.stack));
					} else {
						message.edit('Duplicate slash (' + name + ') found.').then(response => {
							response.delete(5000);
						}).catch(error => client.winston.log('error', error.stack));
					}
				});
		}
	},

	delslash: {
		name: 'Delete Slash',
		description: 'If you want to delete a tag, this is the command you would need',
		usage: settings.prefix + 'delslash <name>',
		alias: 'ds',
		execute: function(client, message, args) {
			sql.open('./selfbot.sqlite').then(() => {
				sql.run('DELETE FROM shortcuts WHERE name = ?', args[0])
					.then(() => {
						message.edit('The shortcut (' + args[0] + ') has been deleted').then(response => {
							response.delete(5000);
						});
					})
					.catch(error => client.winston.log('error', error.stack));
			});
		}
	},

	slashes: {
		name: 'Slash Commands',
		description: 'Displays all slash commands',
		usage: '',
		alias: 'sl, slash',
		execute: function(client, message) {
			sql.open('./selfbot.sqlite').then(() => sql.all('SELECT * FROM shortcuts')).then(rows => {
				let msga = [];
				msga.push('\`\`\`LDIF');
				var longest = rows.reduce(function(a, b) {
					return a.name.length > b.name.length ? a : b;
				});
				rows.map(row => {
					let padded = (row.name + ' '.repeat(longest.name.length + 1 - row.name.length));
					msga.push(`${settings.prefix}${padded}: ${row.contents}`);
				});
				msga.push('\`\`\`');
				message.edit(msga).then(response =>
					response.delete(10000)
				);
			}).catch(error => client.winston.log('error', error.stack));
		}
	}

};

function clean(text) {
	if (typeof(text) === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	} else {
		return text;
	}
}

const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

exports.toTitleCase = toTitleCase;
exports.aliases = aliases;
exports.commands = commands;
exports.settings = settings;
