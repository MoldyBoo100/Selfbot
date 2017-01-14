exports.run = function(client, message, args) {
	let result = args.join(' ');
	if (!result) {
		result = null;
	}
	client.user.setGame(result).then(() => {
		let text = result ? 'Game changed to ' + result : 'Game Cleared';
		message.edit(text).then(response => response.delete(1000).catch(error => console.log(error.stack)));
	}).catch(error => console.log(error.stack));
};
