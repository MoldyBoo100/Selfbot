exports.run = function(client, message) {
	let nickname = message.guild.member(client.user).nickname;
	let username = message.guild.member(client.user).user.username;
	if (!nickname) {
		message.guild.member(client.user).setNickname(username + ' [is sleeping]').then(() => {
			message.edit('Set to sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		}).catch(error => console.log(error.stack));
	} else

	if (nickname.search(' [is sleeping]')) {
		message.guild.member(client.user).setNickname('').then(() => {
			message.edit('No longer sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		}).catch(error => console.log(error.stack));
	} else

	if (nickname && !nickname.includes(' [is sleeping]')) {
		message.guild.member(client.user).setNickname(nickname + ' [is sleeping]').then(() => {
			message.edit('Set to sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		}).catch(error => console.log(error.stack));
	} else if (nickname.search(' [is sleeping]')) {
		message.guild.member(client.user).setNickname(nickname.replace(/ \[is sleeping\]/g, '')).then(() => {
			message.edit('No longer sleeping').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		}).catch(error => console.log(error.stack));
	}

};
