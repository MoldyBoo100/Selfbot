exports.run = function(client, message, args) {
	let messagecount = parseInt(args);
	message.channel.fetchMessages({
		limit: messagecount + 1
	})
		.then(messages => {
			messages.map(m => m.delete()
				.catch(error => console.log(error.stack)));
		});
};
