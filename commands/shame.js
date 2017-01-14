exports.run = function(client, message) {
	if (!message.mentions.users.first()) {
		message.edit('You need to @mention someone to shame them')
			.then(response => response.delete(1000).catch(error => console.log(error.stack)))
			.catch(error => console.log(error.stack));
	} else {
		message.edit('SHAME :bell: ' + message.mentions.users.first() + ' :bell: SHAME')
			.catch(error => console.log(error.stack));
	}
};
