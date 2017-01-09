var asyncElement = require('../pageObjectUtils').asyncElement;

function RadioOption(selector) {
	this.element = function () {
		return asyncElement(selector);
	};

	this.isSelected = function () {
		return this.element().getAttribute('checked').then(function (checked) {
			return checked === 'true';
		});
	};
	this.select = function () {
		return this.element().click();
	};
}

module.exports = RadioOption;
