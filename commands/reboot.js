exports.run = function(client, message) {
	message.edit('Rebooting...').then(() => {
		process.exit();
	}).catch(error => console.log(error.stack));
};
