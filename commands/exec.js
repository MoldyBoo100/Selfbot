const exec = require('child_process').exec;
exports.run = function(client, message, args) {
	message.delete();
	exec(`${args.join(' ')}`, (error, stdout) => {
		if (error) message.channel.sendCode('', error, {split:true})
			.then(message => message.delete(10000)
				.catch(error => console.log(error)))
			.catch(error => console.log(error));
		message.channel.sendCode('', stdout, {split:true})
			.then(message => message.delete(10000)
				.catch(error => console.log(error)))
			.catch(error => console.log(error));
	});
};
