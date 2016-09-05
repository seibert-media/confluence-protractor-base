var confluenceConfig = require("../confluenceConfig");

var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;

function ConfluenceLogin() {

	var self = this;

	this.login = function (username, password) {
		browser.get('/login.action');

		this.currentUsername().then(function (currentUsername) {
			if (username === currentUsername) {
				// user is already logged in: redirect to dashboard
				browser.get('/');
				return;
			}

			if (currentUsername !== '') {
				console.log('Logged in with wrong user (' + currentUsername + '). Switch to: ' + username);
				// logout if logged in with wrong user
				self.logout();
				browser.get('/login.action');
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
		this.login(confluenceConfig.USERS.ADMIN.USERNAME, confluenceConfig.USERS.ADMIN.PASSWORD);
	};

	this.authenticateAsAdmin = function () {
		this.loginAsAdmin();

		// authenticate
		browser.get('/authenticate.action');

		element(by.name('password')).sendKeys(confluenceConfig.USERS.ADMIN.PASSWORD);
		element(by.name('authenticate')).click();

		browser.get('/admin');

		assert(element(by.css('.admin-body')).isPresent(), true, 'Admin authentication failed');
	};

	this.currentUsername = function () {
		return browser.executeScript(function () {
			return AJS.params.remoteUser;
		});
	};

	this.logout = function () {
		browser.get('/logout.action');
	};

	function clickIfPresent(elementPromise) {
		elementPromise.isPresent().then(function (isPresent) {
			if (isPresent) {
				elementPromise.click();
			}
		});
	}
	this.skipWelcomeProcedure = function () {
		// skip video
		clickIfPresent(element(by.id('grow-intro-video-skip-button')));

		// skip picture
		clickIfPresent(element(by.css('[data-action="skip"]')));

		// select space
		clickIfPresent(element.all(by.css('.space-checkbox input.checkbox')).first());
		clickIfPresent(element(by.css('.intro-find-spaces-button-continue')));

		// load dashboard again
		browser.refresh();
	};

	this.confirmTermsOfUse = function () {
		clickIfPresent(element(by.css('form[action="/plugins/termsofuse/agreement.action"] input[type="submit"]')));

		// load dashboard again
		browser.refresh();
	}

}

module.exports = ConfluenceLogin;
