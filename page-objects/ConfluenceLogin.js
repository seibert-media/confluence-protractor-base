var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var Version = require('../utils/Version');

var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;
var openPage = pageObjectUtils.openPage;
var asyncElement = pageObjectUtils.asyncElement;

function ConfluenceLogin() {
	var self = this;

	this.confluenceConfig = require("../loadConfluenceConfig");

	function testUser() {
		return self.confluenceConfig().USERS.TEST_USER;
	}

	function admin() {
		return self.confluenceConfig().USERS.ADMIN;
	}

	this.actions = {
		login: new ConfluenceAction({
			path: 'login.action'
		}),
		logout: new ConfluenceAction({
			path: 'logout.action'
		}),
		authenticate: new ConfluenceAction({
			path: 'authenticate.action'
		})
	};

	this.login = function (username, password) {
		username = username || testUser().USERNAME;
		password = password || testUser().PASSWORD;

		this.currentUsername().then(function (currentUsername) {
			if (username === currentUsername) {
				// user is already logged in: redirect to dashboard
				return;
			}

			if (currentUsername !== '') {
				console.log('Logged in with wrong user (' + currentUsername + '). Switch to: ' + username);
				// logout if logged in with wrong user
				self.actions.logout.open();
			}

			self.actions.login.open({ignoreSearch: true});

			asyncElement(by.name('os_username')).sendKeys(username);
			asyncElement(by.name('os_password')).sendKeys(password);

			var loginButton = asyncElement(by.id('loginButton')); // pageObjectUtils.logPromise(loginButton.isPresent());
			loginButton.click();

			assert(asyncElement(by.css('#captcha-container')).isPresent(), false, 'Captcha required. Log in manually once.');

			browser.getCurrentUrl().then(function (url) {
				if (url.endsWith('plugins/termsofuse/agreement.action')) {
					console.warn('Confirm terms of use for  "' + username + '" (possibly dependent from plugin version)');
					self.confirmTermsOfUse();
				}
			});

			browser.getCurrentUrl().then(function (url) {
				if (url.endsWith('welcome.action')) {
					console.warn('Try to skip welcome.action for "' + username + '" (possibly dependent from confluence version)');
					self.skipWelcomeProcedure();
				}
			});
		});
	};

	this.authenticate = function (password) {
		password = password || testUser().PASSWORD;

		// authenticate
		self.actions.authenticate.open();

		asyncElement(by.name('password')).sendKeys(password);
		asyncElement(by.name('authenticate')).click();
	};

	this.loginAsAdmin = function () {
		this.login(admin().USERNAME, admin().PASSWORD);
	};

	this.authenticateAsAdmin = function () {
		this.loginAsAdmin();

		this.authenticate(admin().PASSWORD)
	};

	this.currentUsername = function () {
		return this.getParamFromAJS('remoteUser', '');
	};

	this.getParamFromAJS = function (paramName, defaultValue) {
		return browser.executeScript(function () {
			if (!window.AJS || !window.AJS.params) {
				return {};
			}
			return AJS.params;
		}).then(function (params) {
			return params[paramName] || defaultValue;
		});
	};

	this.logout = function () {
		self.actions.logout.open();
	};

	this.skipWelcomeProcedure = function () {
		// skip welcome message
		clickIfPresent(asyncElement(by.id('grow-intro-welcome-start')));

		// skip video
		clickIfPresent(asyncElement(by.id('grow-intro-video-skip-button')));

		// skip picture
		clickIfPresent(asyncElement(by.css('[data-action="skip"]')));

		// select space
		clickIfPresent(asyncElement.all(by.css('.space-checkbox input.checkbox')).first());
		clickIfPresent(asyncElement(by.css('.intro-find-spaces-button-continue')));

		// reload dashboard
		openPage();
	};

	this.skipLicenseHealthCheck = function() {
		// aui flag warning if license health check failed
		var licenseHealthCheck = asyncElement.all(by.css('#healthcheck-notification .dismiss-notification'));

		pageObjectUtils.clickIfPresent(licenseHealthCheck);
		console.log('Skipped "license health check"');
	};

	this.confirmTermsOfUse = function () {
		clickIfPresent(asyncElement(by.css('form[action="/plugins/termsofuse/agreement.action"] input[type="submit"]')));

		// reload dashboard
		openPage();
	}

}

module.exports = ConfluenceLogin;
