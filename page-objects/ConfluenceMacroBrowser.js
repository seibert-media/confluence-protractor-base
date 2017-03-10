var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceEditor = require('./ConfluenceEditor');
var AutocompleteSearch = require('../utils/elements/AutocompleteSearch');
var pageObjectUtils = require('../utils/pageObjectUtils');

function ConfluenceMacroBrowser(macroName) {
	this.macroName = macroName;
	var editor = new ConfluenceEditor();

	pageObjectUtils.assertNotNull(this.macroName, 'First param "macroName" must be set');

	this.insertMacroViaBracket = function () {
		var macroAutocomplete = new AutocompleteSearch({
			searchTerm: this.macroName,
			inputElement: editor.editor,
			resultContainer: element(by.css('.autocomplete-macros'))
		});

		macroAutocomplete
			.search({searchPrefix: '{', skipClear: true})
			.waitForMatchingResult()
			.selectResult();
	};
}

ConfluenceMacroBrowser.prototype = new ConfluenceBase();

module.exports = ConfluenceMacroBrowser;
