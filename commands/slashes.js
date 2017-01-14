exports.run = function(client, message) {
	client.sql.open('./selfbot.sqlite').then(() => client.sql.all('SELECT * FROM shortcuts')).then(rows => {
		let msga = [];
		msga.push('\`\`\`LDIF');
		var longest = rows.reduce(function(a, b) {
			return a.name.length > b.name.length ? a : b;
		});
		rows.map(row => {
			let padded = (row.name + ' '.repeat(longest.name.length + 1 - row.name.length));
			msga.push(`${client.settings.prefix}${padded}: ${row.contents}`);
		});
		msga.push('\`\`\`');
		message.edit(msga).then(response =>
			response.delete(10000)
		);
	}).catch(error => client.winston.log('error', error.stack));
};
