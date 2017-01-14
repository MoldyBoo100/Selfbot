const request = require('request');
const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
exports.run = function(client, message, args) {
	let input = args.join(' ');
	let resultDef = input.split('#')[0];
	let resultNum = input.split('#')[1];
	const baseUrl = 'http://api.urbandictionary.com/v0/define?term=';
	const theUrl = baseUrl + resultDef;
	request({
		url: theUrl,
		json: true,
	}, (error, response, body) => {
		if (!resultNum) {
			resultNum = 0;
		} else if (resultNum > 1) {
			resultNum -= 1;
		}
		const result = body.list[resultNum];
		if (result) {
			const embed = {
				title: `**Word:** ${toTitleCase(resultDef)}`,
				url: result.permalink,
				color: 0xdd2825,
				thumbnail: { url: 'http://i.imgur.com/CcIZZsa.png' },
				description: `**Definition:** ${resultNum += 1} out of ${body.list.length}\n_${result.definition}_\n\n**Example:**\n${result.example}\n\nSubmitted by ${result.author}`,
				fields: [{
					name: '\u200B',
					value: `\:thumbsup: ${result.thumbs_up}`,
					inline: true
				}, {
					name: '\u200B',
					value: `\:thumbsdown: ${result.thumbs_down}`,
					inline: true
				}],
				// thumbnail:{url:'http://i.imgur.com/YBqkmPU.png'},
				footer: {
					text: '© Urban Dictionary'
				}
			};
			message.edit(`Define ${result.word}`, {embed}).catch(err => console.log(err));
		} else {
			message.edit('No entry found.').catch(err => console.log(err));
		}
	});

};
