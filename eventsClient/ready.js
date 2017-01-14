const settings = require('../settings.json');
module.exports = client => {
	var log = (message) => {
		client.channels.get(settings.logs).sendMessage(message).catch(error => console.log(error));
	};
	delete client.user.email;
	delete client.user.verified;
	let bootup = [
		'```xl',
		'BOOT TIME STATISTICS',
		`• Booted   : ${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString()}`,
		`• Users    : ${client.users.size}`,
		`• Servers  : ${client.guilds.size}`,
		`• Channels : ${client.channels.size}`,
		'```'
	];
	log(bootup);
};
