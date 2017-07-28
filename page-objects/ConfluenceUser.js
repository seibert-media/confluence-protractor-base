var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');

// page object utils imports
var asyncElement = pageObjectUtils.asyncElement;

function ConfluenceUser(username, fullName, email, password) {

	this.username = username;
	this.fullName = fullName;
	this.email = email;
	this.password = password;

	this.actions = {
		createUser: new ConfluenceAction({
			path: 'admin/users/createuser.action'
		}),
		removeUser: new ConfluenceAction({
			path: 'admin/users/removeuser.action?username=' + username
		}),
		userProfile: new ConfluenceAction({
			path: 'display/~' + username
		}),
		userAdminView: new ConfluenceAction({
			path: 'admin/users/viewuser.action?username=' + username
		})
	};

	this.create = function () {
		this.actions.createUser.open();

		asyncElement(by.name('username')).sendKeys(username);
		asyncElement(by.name('fullName')).sendKeys(fullName);
		asyncElement(by.name('email')).sendKeys(email);
		asyncElement(by.name('password')).sendKeys(password);
		asyncElement(by.name('confirm')).sendKeys(password).sendKeys(protractor.Key.ENTER);

		// element(by.name('confirm'))
	};

	this.remove = function () {
		this.actions.removeUser.open();
		asyncElement(by.id('confirm')).click();
	};

	this.hasGroup = function (groupName) {
		this.actions.userAdminView.open();

		var selector = '[href="domembersofgroupsearch.action?membersOfGroupTerm=' + groupName + '"]';
		return asyncElement(by.css(selector)).isPresent();
	}
}

ConfluenceUser.prototype = new ConfluenceBase();

module.exports = ConfluenceUser;
