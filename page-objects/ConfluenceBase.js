var ConfluenceLogin = require('./ConfluenceLogin');
var pageObjectUtils = require('../utils/pageObjectUtils');
var Version = require('../utils/Version');

var openPage = pageObjectUtils.openPage;

// cache confluence version for all ConfluenceLogin instances
var confluenceVersion;

function ConfluenceBase() {
	var self = this;

	this.openAdminPage = function (path) {
		path = path || 'admin';
		openPage(path);

		pageObjectUtils.getCurrentPath().then(function (currentPath) {
			if (currentPath === 'authenticate.action' || currentPath === 'login.action') {
				self.authenticateAsAdmin();
				openPage(path);
			}
		});
	};

	this.resetConfluenceVersion = function () {
		confluenceVersion = undefined;
	};

	this.loadConfluenceVersion = function () {
		return this.getParamFromAJS('versionNumber').then(function(version) {
			confluenceVersion = Version.parse(version);
			return confluenceVersion;
		});
	};

	this.confluenceVersion = function () {
		if (!confluenceVersion) {
			throw new Error('No confluenceVersion is loaded. Use loadConfluenceVersion in a setup function (onPrepare)')
		}
		return confluenceVersion;
	};

	this.disableNotifications = function() {
		console.log('disabling notifications');
		pageObjectUtils.takeScreenshot('disabling_notifications.png');

		self.openAdminPage('plugins/servlet/stp/view/?source=notification');

		pageObjectUtils.asyncElement(By.css('.notification-toggle')).click();

		pageObjectUtils.takeScreenshot('disabled_notifications.png');

		element(By.css('option[value="critical"]')).click();
	};
}

ConfluenceBase.prototype = new ConfluenceLogin();

module.exports = ConfluenceBase;
