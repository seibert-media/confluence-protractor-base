var RadioOption = require('./RadioOption');

function CheckboxOption(selector) {
	RadioOption.call(this, selector);

	var self = this;

	this.toggle = this.select;

	this.select = function () {
		return this.isSelected().then(function (isSelected) {
			if (!isSelected) {
				self.toggle();
			}
		});
	};

	this.unselect = function () {
		return this.isSelected().then(function (isSelected) {
			if (isSelected) {
				self.toggle();
			}
		});
	};
}

module.exports = CheckboxOption;
