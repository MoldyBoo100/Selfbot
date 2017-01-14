exports.run = function(client, message, args) {
	let name = args[0];
	let contents = args.slice(1).join(' ');
	client.sql.open('./selfbot.sqlite').then(() => client.sql.get(`SELECT * FROM tags WHERE name = '${name}'`)).then(row => {
		if (!row) {
			client.sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [name, contents]).then(() => {
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

};
