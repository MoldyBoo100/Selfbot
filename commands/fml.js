const request = require('superagent');
var HTMLParser = require('fast-html-parser');
exports.run = function(client, message) {
	request
		.get('http://www.fmylife.com/random')
		.end((err, res) => {
			if (err) return message.reply(err);
			let root = HTMLParser.parse(res.text);
			let article = root.querySelector('.post.article .fmllink');
			message.edit(article.childNodes[0].text).catch(error => console.log(error.stack));
		});
};
