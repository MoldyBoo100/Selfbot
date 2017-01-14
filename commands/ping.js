exports.run = function(client, message) {
	message.edit(`Pong! \`${new Date().getTime() - message.createdTimestamp}\` ms`).then(m => m.delete(10000)).catch(error => console.log(error.stack));
};
