"use strict";

const Forwarded = require('Forwarded');

exports.register = (server, options) => {
	server.ext({
		type: 'onRequest',
		method: (request, h) => {
			let remoteAddress = Forwarded(request.raw.req).pop().trim();
			if (remoteAddress) {
				request.info.remoteAddress = remoteAddress;
			}
			return h.continue;
		}
	});
};

exports.name = require('../package.json')['name'];
exports.register.attributes = {
	pkg: require('../package.json')
};
