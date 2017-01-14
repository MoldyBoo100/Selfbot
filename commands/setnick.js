exports.run = function(client, message, args) {
	message.guild.member(client.user).setNickname(args.join(' ')).then(() => {
		let text = args.join(' ') ? 'Nickname changed to ' + args.join(' ') : 'Nickname Cleared';
		message.edit(text).then(response => response.delete(1000).catch(error => console.log(error.stack)));
	}).catch(error => console.log(error.stack));
};
