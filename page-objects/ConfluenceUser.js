var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var CheckboxOption = require('../utils/elements/CheckboxOption');

// page object utils imports
var asyncElement = pageObjectUtils.asyncElement;

function ConfluenceUser(username, fullName, email, password) {
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

	pageObjectUtils.assertNotNull(username, 'options.username is required');

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
		}),
		searchUser: new ConfluenceAction({
			path: 'dosearchsite.action?queryString=' + fullName.replace(' ', '+')
		}),
		editUserGroups: new ConfluenceAction({
			path: "admin/users/editusergroups-start.action?username=" + username
		}),
		viewPersonalSpace: new ConfluenceAction({
			path: 'spaces/viewspace.action?key=~' + username
		}),
		createPersonalSpace: new ConfluenceAction({
			path: 'spaces/createpersonalspace.action'
		})
	};

	this.create = function () {
		this.actions.createUser.open();

		asyncElement(by.name('username')).sendKeys(username);
		asyncElement(by.name('fullName')).sendKeys(fullName);
		asyncElement(by.name('email')).sendKeys(email);

		var sendMailInput = new CheckboxOption(by.name('sendEmail'));
		sendMailInput.element().isPresent().then(function (isMailServerConfigured) {
			if (isMailServerConfigured) {
				sendMailInput.unselect();
			}
		});

		asyncElement(by.name('password')).sendKeys(password);
		asyncElement(by.name('confirm')).sendKeys(password);

		asyncElement(by.css('#create-user-form [type="submit"]')).click();
	};

	this.remove = function () {
		this.actions.removeUser.open();
		asyncElement(by.id('confirm')).click();
	};

	this.hasGroup = function (groupName) {
		this.actions.userAdminView.open();

		var selector = '[href="domembersofgroupsearch.action?membersOfGroupTerm=' + groupName + '"]';
		return asyncElement(by.css(selector)).isPresent();
	};

	this.isInSearchIndex = function () {
		this.actions.searchUser.open({refreshAlways: true});

		var userProfileSearchPath = this.actions.userProfile.path;

		if (this.confluenceVersion().lessThan('5.9')) {
			userProfileSearchPath = userProfileSearchPath + '?src=search';
		}

		return element(by.css('a.search-result-link[href="/' + userProfileSearchPath + '"]')).isPresent();
	};

	this.waitUntilUserInSearchIndex = function () {
		return browser.wait(this.isInSearchIndex.bind(this), DEFAULT_LOADING_TIMEOUT);
	};

	this.addGroup = function (groupname) {
		return changeGroup.call(this, groupname, 'select');
	};

	this.removeGroup = function (groupname) {
		return changeGroup.call(this, groupname, 'unselect');
	};

	this.viewPersonalSpace = function() {
		this.actions.viewPersonalSpace.open();
	};

	this.createPersonalSpace = function() {
		this.actions.createPersonalSpace.open();
		return element(by.css(".create-dialog-create-button")).click();
	};

	this.removePersonalSpace = function() {
		// TODO
		return;
	};

	function changeGroup(groupname, operation) {
		var form = "form#editusergroupsform";
		var groupCheckbox = form + " input[name='newGroups']#" + groupname;
		this.actions.editUserGroups.open();
		var checkboxOption = new CheckboxOption(by.css(groupCheckbox));
		checkboxOption[operation]();
		return element(by.css(form + " input[type='submit']")).click();
	}
}

ConfluenceUser.prototype = new ConfluenceBase();

module.exports = ConfluenceUser;
