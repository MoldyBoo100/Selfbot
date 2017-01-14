const ms = require('ms');
exports.run = function(client, message, args) {
	let result = args.join(' ');
	if (message.author.id !== message.guild.owner.id) return;
	message.channel.overwritePermissions(message.guild.id, {
		SEND_MESSAGES: false
	}).then(message.channel.sendMessage(`Channel locked down for ${ms(ms(result), { long:true })}, do not be alarmed.`)).catch(error => console.log(error));
	setTimeout(function() {
		message.channel.overwritePermissions(message.guild.id, {
			SEND_MESSAGES: true
		}).then(message.channel.sendMessage(`${ms(ms(result), { long:true })} lockdown has been released.`)).catch(error => console.log(error));
	}, ms(result));
};
