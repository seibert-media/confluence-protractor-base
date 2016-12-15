var ConfluenceLogin = require('./ConfluenceLogin');
var pageObjectUtils = require('../utils/pageObjectUtils');

var openPage = pageObjectUtils.openPage;

function ConfluenceBase() {
	var self = this;

	this.openAdminPage = function () {
		this.authenticateAsAdmin();
		openPage('/admin');
	};

}

ConfluenceBase.prototype = new ConfluenceLogin();

module.exports = ConfluenceBase;
