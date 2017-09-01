var ConfluenceLogin = require('./ConfluenceLogin');
var pageObjectUtils = require('../utils/pageObjectUtils');
var Version = require('../utils/Version');

var takeScreenshot = pageObjectUtils.takeScreenshot;
var asyncElement = pageObjectUtils.asyncElement;
var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

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
		return this.getParamFromAJS('versionNumber').then(function (version) {
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

	this.disableNotifications = function () {
		if (self.confluenceVersion().greaterThan('5.9')) {
			console.log('disable notifications');
			self.openAdminPage('plugins/servlet/stp/view/?source=notification');
			takeScreenshot('disabling_notifications.png');

			asyncElement(By.css('.notification-toggle'), DEFAULT_LOADING_TIMEOUT).click();

			takeScreenshot('disabled_notifications.png');

			element(By.css('option[value="critical"]')).click();
		} else {
			console.log('skipped disable notifications as Confluence version <= 5.9');
		}
	};

	this.skipNotifications = function () {
		takeScreenshot('skip_notifications.png');
		asyncElement.all(by.css('.dismiss-notification')).each(function (notification) {
			console.log("skipped notification");
			notification.click();
		});
	};
}

ConfluenceBase.prototype = new ConfluenceLogin();

module.exports = ConfluenceBase;
