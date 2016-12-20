
var Version = require('../utils/Version');
var screenshotReporter = require('../jasmineReporters/screenshotReporter');

describe('Version', function() {

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	describe('parse()', function () {
		it('creates Version object for 5.10.1', function () {
			expect(Version.parse('5.10.1')).toEqual(new Version('5.10.1', 5, 10, 1));
		});

		it('creates Version object for 6.0.1', function () {
			expect(Version.parse('6.0.1')).toEqual(new Version('6.0.1', 6, 0, 1));
		});

		it('creates Version object for 6.0.1', function () {
			expect(Version.parse('5.6')).toEqual(new Version('5.6', 5, 6));
		});
	});

	describe('compare()', function () {
		function versionCompare(versionA, versionB) {
			return Version.compare(Version.parse(versionA), Version.parse(versionB));
		}

		describe('equals cases', function () {
			it('check that 6.0.2 is equals 6.0.2', function () {
				expect(versionCompare('6.0.2', '6.0.2')).toBe(0);
			});

			it('check that 6.0 is equals 6.0.2', function () {
				expect(versionCompare('6.0', '6.0.2')).toBe(0);
			});

			it('check that 6 is equals 6.0.2', function () {
				expect(versionCompare('6', '6.0.2')).toBe(0);
			});

			it('check that 5.10 is equals 5.10.1', function () {
				expect(versionCompare('5.10', '5.10.1')).toBe(0);
			});

			it('check that 5.7 is equals 5', function () {
				expect(versionCompare('5.7', '5')).toBe(0);
			});
		});

		describe('greater than cases', function () {
			it('check that 6.0.3 is greater than 6.0.2', function () {
				expect(versionCompare('6.0.3', '6.0.2')).toBeGreaterThan(0);
			});

			it('check that 6.1 is greater than  6.0.2', function () {
				expect(versionCompare('6.1', '6.0.2')).toBeGreaterThan(0);
			});

			it('check that 6 is greater than  5.10.2', function () {
				expect(versionCompare('6', '5.10.2')).toBeGreaterThan(0);
			});

			it('check that 6.0 is greater than 5.10.1', function () {
				expect(versionCompare('6.0', '5.10.1')).toBeGreaterThan(0);
			});
		});

		describe('less than cases', function () {
			it('check that 5.7.7 is less than 5.8', function () {
				expect(versionCompare('5.7.7', '5.8')).toBeLessThan(0);
			});

			it('check that 5.10.1 is less than 6.0', function () {
				expect(versionCompare('5.10.1', '6.0')).toBeLessThan(0);
			});

			it('check that 6.0.2 is less than 6.0.3', function () {
				expect(versionCompare('6.0.2', '6.0.3')).toBeLessThan(0);
			});

			it('check that 6.0.2 is less than  6.1', function () {
				expect(versionCompare('6.0.2', '6.1')).toBeLessThan(0);
			});

			it('check that 5.10.2 is less than 6', function () {
				expect(versionCompare('5.10.2', '6')).toBeLessThan(0);
			});
		});

	});


});
