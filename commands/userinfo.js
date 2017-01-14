const moment = require('moment');
exports.run = function(client, message, args) {
	let ui_name = client.guilds.get(message.guild.id).members.get(client.users.find('username', args.join(' ')).id);
	let spymsg = [
		'USER INFO',
		`User ID   : ${ui_name.user.id}`,
		`Nickname  : ${ui_name.nickname}`,
		`Username  : ${ui_name.user.username}`,
		`Discrim   : ${ui_name.user.discriminator}`,
		`Bot       : ${ui_name.user.bot}`,
		`Joined    : ${moment(ui_name.joinedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`,
		`Created   : ${moment(ui_name.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}`,
		`Avatar    : ${ui_name.user.avatarURL}`
	];
	message.editCode('LDIF', spymsg).catch(error => console.log(error.stack)).catch(error => console.log(error.stack));
};
