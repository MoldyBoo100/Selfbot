exports.run = function(client, message, args) {
	client.sql.open('./selfbot.sqlite').then(() => client.sql.get('SELECT * FROM tags WHERE name = ?', args[0])).then(row => {
		if (row) {
			let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
			message.edit(message_content);
		} else {
			message.edit(`Could not find tag (${args[0]}).`).then(response => {
				response.delete(5000);
			});
		}
	}).catch(error => client.winston.log('error', error.stack));
};
