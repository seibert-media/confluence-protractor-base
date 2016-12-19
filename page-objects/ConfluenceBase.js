var ConfluenceLogin = require('./ConfluenceLogin');
var pageObjectUtils = require('../utils/pageObjectUtils');

var openPage = pageObjectUtils.openPage;

function ConfluenceBase() {
	var self = this;

	this.openAdminPage = function (path) {
		path = path || 'admin';
		openPage(path);
		pageObjectUtils.getCurrentPath().then(function (url) {
			if (url.endsWith('authenticate.action') || url.endsWith('login.action')) {
				self.authenticateAsAdmin();
				openPage(path);
			}
		});
	};

}

ConfluenceBase.prototype = new ConfluenceLogin();

module.exports = ConfluenceBase;
