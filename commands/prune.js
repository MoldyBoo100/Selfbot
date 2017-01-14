exports.run = function(client, message, args) {
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
};
