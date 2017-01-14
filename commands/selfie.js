/*
	This selfie command is only possible due to hosting my bot on my raspberry pi
	it has a webcam hooked up directly, and with using child_process with fswebcam
	I am able to take pictures on command, unless you're hosting your bot on a linux
	machine such as a home server, or raspberry pi with a webcam attached, you should
	delete this command from your folder.
*/
const fse = require('fs-promise');
const exec = require('child_process').exec;
exports.run = function(client, message, args) {
	message.delete();
	exec('fswebcam --fps 15 -S 8 -r 400x225 --no-banner selfie.jpg', (error) => {
		// callback runs when the command is done!
		if (error) return console.log(error);
		const image = fse.readFileSync('selfie.jpg');
		client.channels.get(message.channel.id).sendFile(image, 'selfie.jpg', args.join(' '));
	});
};
