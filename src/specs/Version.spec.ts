import {Version} from "../utils/Version";

const screenshotReporter = require("../jasmineReporters/screenshotReporter").screenshotReporter;

describe("Version", () => {

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	describe("parse()", () => {
		it("creates Version object for 5.10.1", () => {
			expect(Version.parse("5.10.1")).toEqual(new Version("5.10.1", 5, 10, 1));
		});

		it("creates Version object for 6.0.1", () => {
			expect(Version.parse("6.0.1")).toEqual(new Version("6.0.1", 6, 0, 1));
		});

		it("creates Version object for 6.0.1", () => {
			expect(Version.parse("5.6")).toEqual(new Version("5.6", 5, 6));
		});

		it('ignores "-rc" suffixes', () => {
			expect(Version.parse("6.1.0-rc1")).toEqual(new Version("6.1.0", 6, 1, 0));
		});

		it('ignores "-m" suffixes', () => {
			expect(Version.parse("6.3.0-m04")).toEqual(new Version("6.3.0", 6, 3, 0));
		});
	});

	describe("compare()", () => {

		describe("equals cases", () => {
			it("check that 6.0.2 equals 6.0.2", () => {
				expect(Version.compare("6.0.2", "6.0.2")).toBe(0);
				expect(Version.parse("6.0.2").equals("6.0.2")).toBe(true);
				expect(Version.parse("6.0.2").lessThanEquals("6.0.2")).toBe(true);
				expect(Version.parse("6.0.2").greaterThanEquals("6.0.2")).toBe(true);

			});

			it("check that 6.0 equals 6.0.2", () => {
				expect(Version.compare("6.0", "6.0.2")).toBe(0);
				expect(Version.parse("6.0").equals("6.0.2")).toBe(true);
				expect(Version.parse("6.0").lessThanEquals("6.0.2")).toBe(true);
				expect(Version.parse("6.0").greaterThanEquals("6.0.2")).toBe(true);
			});

			it("check that 6 equals 6.0.2", () => {
				expect(Version.compare("6", "6.0.2")).toBe(0);
				expect(Version.parse("6").equals("6.0.2")).toBe(true);
				expect(Version.parse("6").lessThanEquals("6.0.2")).toBe(true);
				expect(Version.parse("6").greaterThanEquals("6.0.2")).toBe(true);
			});

			it("check that 5.10 equals 5.10.1", () => {
				expect(Version.compare("5.10", "5.10.1")).toBe(0);
				expect(Version.parse("5.10").equals("5.10.1")).toBe(true);
				expect(Version.parse("5.10").lessThanEquals("5.10.1")).toBe(true);
				expect(Version.parse("5.10").greaterThanEquals("5.10.1")).toBe(true);
			});

			it("check that 5.7 equals 5", () => {
				expect(Version.compare("5.7", "5")).toBe(0);
				expect(Version.parse("5.7").equals("5")).toBe(true);
				expect(Version.parse("5.7").lessThanEquals("5")).toBe(true);
				expect(Version.parse("5.7").greaterThanEquals("5")).toBe(true);
			});
		});

		describe("greater than cases", () => {
			it("check that 6.0.3 is greater than 6.0.2", () => {
				expect(Version.compare("6.0.3", "6.0.2")).toBeGreaterThan(0);
				expect(Version.parse("6.0.3").greaterThan("6.0.2")).toBe(true);
			});

			it("check that 6.1 is greater than  6.0.2", () => {
				expect(Version.compare("6.1", "6.0.2")).toBeGreaterThan(0);
				expect(Version.parse("6.1").greaterThan("6.0.2")).toBe(true);
			});

			it("check that 6 is greater than  5.10.2", () => {
				expect(Version.compare("6", "5.10.2")).toBeGreaterThan(0);
				expect(Version.parse("6").greaterThan("5.10.2")).toBe(true);
			});

			it("check that 6.0 is greater than 5.10.1", () => {
				expect(Version.compare("6.0", "5.10.1")).toBeGreaterThan(0);
				expect(Version.parse("6.0").greaterThan("5.10.1")).toBe(true);
			});
		});

		describe("less than cases", () => {
			it("check that 5.7.7 is less than 5.8", () => {
				expect(Version.compare("5.7.7", "5.8")).toBeLessThan(0);
				expect(Version.parse("5.7.7").lessThan("5.8")).toBe(true);
			});

			it("check that 5.10.1 is less than 6.0", () => {
				expect(Version.compare("5.10.1", "6.0")).toBeLessThan(0);
				expect(Version.parse("5.10.1").lessThan("6.0")).toBe(true);
			});

			it("check that 6.0.2 is less than 6.0.3", () => {
				expect(Version.compare("6.0.2", "6.0.3")).toBeLessThan(0);
				expect(Version.parse("6.0.2").lessThan("6.0.3")).toBe(true);
			});

			it("check that 6.0.2 is less than  6.1", () => {
				expect(Version.compare("6.0.2", "6.1")).toBeLessThan(0);
				expect(Version.parse("6.0.2").lessThan("6.1")).toBe(true);
			});

			it("check that 5.10.2 is less than 6", () => {
				expect(Version.compare("5.10.2", "6")).toBeLessThan(0);
				expect(Version.parse("5.10.2").lessThan("6")).toBe(true);
			});
		});

	});

});
