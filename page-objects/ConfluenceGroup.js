var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var CheckboxOption = require('../utils/elements/CheckboxOption');

// page object utils imports
var asyncElement = pageObjectUtils.asyncElement;

function ConfluenceGroup(groupname) {

	this.actions = {
		browseGroups: new ConfluenceAction({
			path: 'admin/users/browsegroups.action'
		})
	};

	this.getGroupname = function () {
		return groupname;
	};

	this.create = function () {
		this.actions.browseGroups.open();
		element(by.id('switch-button')).click();
		var formContainer = '#create-group-form';
		asyncElement(by.css(formContainer + ' input[name="name"]')).sendKeys(groupname);
		return element(by.css(formContainer + " input[type='submit']")).click();
	};

	this.exists = function () {
		this.actions.browseGroups.open();
		filterGroup();
		return asyncElement(by.id("group-row-" + groupname)).isPresent();
	};

	this.remove = function () {
		this.actions.browseGroups.open();
		filterGroup();
		var removeGroupButton = asyncElement(by.id(groupname + "-group-link"));
		removeGroupButton.click();
		return asyncElement(by.name("confirm")).click();
	};

	function filterGroup() {
		asyncElement(by.name("searchTerm")).sendKeys(groupname).sendKeys(protractor.Key.ENTER);
	}
}

ConfluenceGroup.prototype = new ConfluenceBase();

module.exports = ConfluenceGroup;
