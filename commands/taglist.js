exports.run = function(client, message) {
	client.sql.open('./selfbot.sqlite').then(() => client.sql.all('SELECT * FROM tags')).then(rows => {
		message.edit('Tags: ' + rows.map(r => r.name).join(', ')).then(response =>
			response.delete(15000)
		);
	}).catch(error => client.winston.log('error', error.stack));
};
