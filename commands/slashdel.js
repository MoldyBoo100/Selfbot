exports.run = function(client, message, args) {
	client.sql.open('./selfbot.sqlite').then(() => {
		client.sql.run('DELETE FROM shortcuts WHERE name = ?', args[0])
			.then(() => {
				message.edit('The shortcut (' + args[0] + ') has been deleted').then(response => {
					response.delete(5000);
				});
			})
			.catch(error => client.winston.log('error', error.stack));
	});
};
