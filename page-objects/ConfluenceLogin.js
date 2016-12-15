var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;
var openPage = pageObjectUtils.openPage;
var element = pageObjectUtils.asyncElement;

function ConfluenceLogin() {
	this.confluenceConfig = require("../loadConfluenceConfig");

	var self = this;

	this.login = function (username, password) {
		openPage('/login.action');

		this.currentUsername().then(function (currentUsername) {
			if (username === currentUsername) {
				// user is already logged in: redirect to dashboard
				openPage('/');
				return;
			}

			if (currentUsername !== '') {
				console.log('Logged in with wrong user (' + currentUsername + '). Switch to: ' + username);
				// logout if logged in with wrong user
				self.logout();
				openPage('/login.action');
			}

			element(by.name('os_username')).sendKeys(username);
			element(by.name('os_password')).sendKeys(password);

			var loginButton = element(by.id('loginButton')); // pageObjectUtils.logPromise(loginButton.isPresent());
			loginButton.click();

			assert(element(by.css('#captcha-container')).isPresent(), false, 'Captcha required. Log in manually once.');

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

	this.loginAsAdmin = function () {
		this.login(this.confluenceConfig().USERS.ADMIN.USERNAME, this.confluenceConfig().USERS.ADMIN.PASSWORD);
	};

	this.authenticateAsAdmin = function () {
		this.loginAsAdmin();

		// authenticate
		openPage('/authenticate.action');

		element(by.name('password')).sendKeys(this.confluenceConfig().USERS.ADMIN.PASSWORD);
		element(by.name('authenticate')).click();

		openPage('/admin');

		assert(element(by.css('.admin-body')).isPresent(), true, 'Admin authentication failed');
	};

	this.currentUsername = function () {
		return browser.executeScript(function () {
			return AJS.params.remoteUser;
		});
	};

	this.logout = function () {
		openPage('/logout.action');
	};

	this.skipWelcomeProcedure = function () {
		// skip welcome message
		clickIfPresent(element(by.id('grow-intro-welcome-start')));

		// skip video
		clickIfPresent(element(by.id('grow-intro-video-skip-button')));

		// skip picture
		clickIfPresent(element(by.css('[data-action="skip"]')));

		// select space
		clickIfPresent(element.all(by.css('.space-checkbox input.checkbox')).first());
		clickIfPresent(element(by.css('.intro-find-spaces-button-continue')));

		// reload dashboard
		openPage('/');
	};

	this.confirmTermsOfUse = function () {
		clickIfPresent(element(by.css('form[action="/plugins/termsofuse/agreement.action"] input[type="submit"]')));

		// reload dashboard
		openPage('/');
	}

}

module.exports = ConfluenceLogin;
