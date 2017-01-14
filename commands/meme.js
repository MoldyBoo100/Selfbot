/*
	This personal meme command is only possible due to hosting my bot on my rPi2
	that has a webcam hooked up directly, and with using child_process with fswebcam
	I am able to take pictures on command, unless you're hosting your bot on a linux
	machine such as a home server, or raspberry pi with a webcam attached, you should
	delete this command from your folder.
*/
const fsp = require('fs-promise');
const exec = require('child_process').exec;
exports.run = function(client, message, args) {
	message.delete();
	let meme = args.join(' ');
	var topKek;
	if (meme.includes('; ')) {
		topKek = meme.split('; ')[0];
	} else {
		topKek = meme;
	}
	let bottomKek = meme.split('; ')[1];
	if (!bottomKek) {
		bottomKek = '';
	}
	const imgW = 400;
	const imgH = 225;
	exec(`fswebcam --fps 15 -S 8 -r ${imgW}x${imgH} --no-banner selfie.jpg`, (error) => {
		// callback runs when the command is done!
		if (error) return console.log(error);
		fsp.readFile('selfie.jpg', (err, output) => {
			if (err) throw err;
			var Canvas = require('canvas'),
				Image = Canvas.Image,
				canvas = new Canvas(imgW, imgH),
				ctx = canvas.getContext('2d');
			let img = new Image;
			img.src = output;
			ctx.drawImage(img, 0, 0);
			ctx.font = '24pt Impact';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.strokeStyle = 'rgb(0, 0, 0)';
			ctx.fillText(topKek.toUpperCase(), imgW / 2, 30, imgW);
			ctx.lineWidth = 1;
			ctx.strokeText(topKek.toUpperCase(), imgW / 2, 30);
			ctx.stroke();
			ctx.fillText(bottomKek.toUpperCase(), imgW / 2, 215, imgW);
			ctx.lineWidth = 1;
			ctx.strokeText(bottomKek.toUpperCase(), imgW / 2, 215);
			ctx.stroke();
			message.channel.sendFile(canvas.toBuffer(undefined, 3, canvas.PNG_FILTER_NONE), 'MemeTastic.png');
		});
	});
};
