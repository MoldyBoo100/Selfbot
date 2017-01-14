exports.run = function(client, message, args) {
	const [replyTo, ...replyText] = args;
	message.channel.fetchMessages({
		limit: 1,
		around: replyTo
	})
		.then(messages => {
			const replyToMsg = messages.first();
			message.channel.sendMessage(`${replyToMsg.author}, ${replyText.join(' ')}`, {
				embed: {
					color: message.member.highestRole.color || 0,
					author: {
						name: `${replyToMsg.author.username} (${replyToMsg.author.id})`,
						icon_url: replyToMsg.author.avatarURL
					},
					description: replyToMsg.content
				}
			}).then(() => message.delete());
		}).catch(console.error);
};
