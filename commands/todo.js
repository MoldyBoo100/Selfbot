exports.run = function(client, message, args) {
	let note = args.join(' ');
	client.channels.get(client.settings.notchannel).sendMessage('***TODO: ***' + note)
    .then(message.edit('Posted successfully.')
      .then(message.delete(1000).catch(error => console.log(error.stack))).catch(error => console.log(error.stack)))
    .catch(error => console.log(error.stack));
};
