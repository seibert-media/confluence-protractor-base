var pageObjectUtils = require('../utils/pageObjectUtils');


function ConfluenceAction(options) {
	var self = this;

	pageObjectUtils.assertNotNull(options.path, 'ConfluenceAction "path" must not be null');

	var path = options.path;

	this.open = function (options) {
		return pageObjectUtils.openPage(path, options);
	};

	Object.keys(options).forEach(function (key) {
		self[key] = options[key];
	});
}


module.exports = ConfluenceAction;
