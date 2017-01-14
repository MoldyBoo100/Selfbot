const reqEvent = (event) => require(`../eventsClient/${event}`);
module.exports = client => {
	client.on('disconnect', () => reqEvent('disconnect')(client));
	client.on('ready', () => reqEvent('ready')(client));
	client.on('reconnecting', () => reqEvent('reconnecting')(client));
	client.on('message', reqEvent('message'));
};
