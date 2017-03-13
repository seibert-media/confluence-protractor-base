var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceEditor = require('./ConfluenceEditor');
var AutocompleteSearch = require('../utils/elements/AutocompleteSearch');
var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;

/**
 *
 * @param macroName Name of macro in UI
 * @param dataMacroName Name of macro that is used in the macro's data attribute in DOM
 * @constructor
 */
function ConfluenceMacroBrowser(macroName, dataMacroName) {
	var pageEditor = new ConfluenceEditor();
	this.macroName = macroName;
	this.dataMacroName = dataMacroName;
	this.macroLocator = by.css('[data-macro-name="' + this.dataMacroName + '"]');

	pageObjectUtils.assertNotNull(this.macroName, 'First param "macroName" must be set');
	pageObjectUtils.assertNotNull(this.dataMacroName, 'First param "dataMacroName" must be set');

	this.insertMacroViaBracket = function () {
		var macroAutocomplete = new AutocompleteSearch({
			searchTerm: this.macroName,
			inputElement: pageEditor.editor,
			resultContainer: element(by.css('.autocomplete-macros'))
		});

		macroAutocomplete
			.search({searchPrefix: '{', skipClear: true})
			.waitForMatchingResult()
			.selectResult();
	};

	this.getMacroElement = function() {
		var self = this;
		return pageEditor.hasEditor().then(function(hasEditor) {
			if (hasEditor) {
				return pageEditor.executeInEditorContext(function() {
					return asyncElement(self.macroLocator);
				});
			} else {
				return asyncElement(self.macroLocator);
			}
		});
	};
}

ConfluenceMacroBrowser.prototype = new ConfluenceBase();

module.exports = ConfluenceMacroBrowser;
