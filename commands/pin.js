const moment = require('moment');
exports.run = function(client, message, args) {
	const notes = client.settings.pinchannel;

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
};
