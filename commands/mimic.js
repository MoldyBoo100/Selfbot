exports.run = function(client, message, args) {
	let targetUser;
	if (args.length === 0) {
		targetUser = client.user;
	} else {
		targetUser = message.guild.members.get(args.join(' ')).user;
	}
	message.delete();
	if (targetUser === client.user) {
		let originalAvatar = 'http://i.imgur.com/9RVt2LJ.png';
		if (message.guild.member(client.user).nickname) {
			message.guild.member(client.user).setNickname('').catch(error => console.log(error));
		}
		client.user.setAvatar(originalAvatar).catch(error => console.log(error));
	} else {
		let nickname = null;
		let avatar;
		if (message.guild.members.get(targetUser.id).nickname === null) {
			nickname = targetUser.username;
		} else {
			nickname = message.guild.members.get(targetUser.id).nickname;
		}
		if (!targetUser.avatar) {
			avatar = null;
		} else {
			avatar = targetUser.avatarURL;
		}
		client.user.setAvatar(avatar).catch(error => console.log(error));
		message.guild.member(client.user).setNickname(nickname).catch(error => console.log(error));
	}
};
