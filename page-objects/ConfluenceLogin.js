var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;
var openPage = pageObjectUtils.openPage;
var element = pageObjectUtils.asyncElement;

function ConfluenceLogin() {
	var self = this;

	this.confluenceConfig = require("../loadConfluenceConfig");

	this.actions = {
		login: new ConfluenceAction({
			path: 'login.action'
		}),
		logout: new ConfluenceAction({
			path: 'logout.action'
		}),
		authenticate: new ConfluenceAction({
			path: 'authenticate.action'
		}),
	}

	this.login = function (username, password) {
		self.actions.login.open();

		this.currentUsername().then(function (currentUsername) {
			if (username === currentUsername) {
				// user is already logged in: redirect to dashboard
				return;
			}

			if (currentUsername !== '') {
				console.log('Logged in with wrong user (' + currentUsername + '). Switch to: ' + username);
				// logout if logged in with wrong user
				self.actions.logout.open();
				self.actions.login.open();
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
		self.actions.authenticate.open();

		element(by.name('password')).sendKeys(this.confluenceConfig().USERS.ADMIN.PASSWORD);
		element(by.name('authenticate')).click();
	};

	this.currentUsername = function () {
		return browser.executeScript(function () {
			return AJS.params.remoteUser;
		});
	};

	this.logout = function () {
		self.actions.logout.open();
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
		openPage();
	};

	this.confirmTermsOfUse = function () {
		clickIfPresent(element(by.css('form[action="/plugins/termsofuse/agreement.action"] input[type="submit"]')));

		// reload dashboard
		openPage();
	}

}

module.exports = ConfluenceLogin;
