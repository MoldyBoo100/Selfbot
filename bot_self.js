const Discord = require('discord.js');
const	client = new Discord.Client();
const settings = require('./settings.json');
const winston = require('winston');
const sql = require('sqlite');
client.login(settings.token).catch(error => console.log(error));
sql.open('./selfbot.sqlite');
winston.add(winston.transports.File, {
	filename: 'logs/selfbot.log'
});

winston.remove(winston.transports.Console);
var log = (message) => {
	client.channels.get(settings.logs).sendMessage(message).catch(error => console.log(error));
};

require('./util/clientEvents')(client);

var reload = (message, cmd) => {
	delete require.cache[require.resolve('./commands/' + cmd)];
	try {
		let cmdFile = require('./commands/' + cmd);
	} catch (err) {
		message.edit(`Problem loading ${cmd}: ${err}`).then(
			response => response.delete(1000).catch(error => console.log(error.stack))
		).catch(error => console.log(error.stack));
	}
	message.edit(`${cmd} reload was a success!`).then(
		response => response.delete(1000).catch(error => console.log(error.stack))
	).catch(error => console.log(error.stack));
};
exports.reload = reload;


// Catch discord.js errors and remove client token,
// Uncomment one below, comment the other out.
// var token = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g; // !2FA tokens
var token = /((?:mfa.[\w-]+))/g; // 2FA Tokens
client.on('error', e => {
	winston.error(e.replace(token, 'that was redacted'));
	log(e.stack);
});

client.on('warn', e => {
	winston.warn(e.replace(token, 'that was redacted'));
	log(e.stack);
});

// Uncomment if you want to debug, very spammy, will output your token.
// client.on('debug', e => {
// 	winston.info(e.replace(token, 'that was redacted'));
// });

client.ws.on('close', (e) => console.log(e.data));
process.on('unhandledRejection', err => {
	console.error('Uncaught Promise Error: \n' + err);
});
