const self = require('../bot_self.js');
exports.run = function(client, message, args) {
	let cmd = args.join(' ');
	self.reload(message, cmd);
};
