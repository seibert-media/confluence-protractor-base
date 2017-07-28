var ConfluenceLogin = require('./ConfluenceLogin');

function ConfluenceBase() {
	var self = this;

	this.openAdminPage = function () {
		this.authenticateAsAdmin();
		browser.get('/admin');
	};

}

ConfluenceBase.prototype = new ConfluenceLogin();

module.exports = ConfluenceBase;
