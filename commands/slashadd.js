exports.run = function(client, message, args) {
	var name = args[0];
	var contents = args.slice(1).join(' ');
	client.sql.open('./selfbot.sqlite').then(() => client.sql.get(`SELECT * FROM shortcuts WHERE name = '${name}'`)).then(
		row => {
			if (!row) {
				client.sql.run('INSERT INTO shortcuts (name, contents) VALUES (?, ?)', [name, contents]).then(() => {
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
};
