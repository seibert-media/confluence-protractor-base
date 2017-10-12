import {browser} from "protractor";
import {ConfluenceBase} from "../page-objects/ConfluenceBase";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {Version} from "../utils/Version";

const screenshotReporter = require("../jasmineReporters/screenshotReporter").screenshotReporter;

describe("ConfluenceBase (page object)", () => {

	const confluenceBase = new ConfluenceBase();
	const confluenceConfig = confluenceBase.confluenceConfig();

	beforeAll(() => {
		pageObjectUtils.openPage();
	});

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	describe("confluence version caching for sync access", () => {
		beforeEach(() => {
			spyOn(confluenceBase, "getParamFromAJS").and.callThrough();
			confluenceBase.resetConfluenceVersion();
		});

		it("has not called getParamForAJS", () => {
			expect(confluenceBase.getParamFromAJS).not.toHaveBeenCalled();
		});

		it("throws an error if confluenceVersionSync() is called without caching", () => {
			expect(() => {
				confluenceBase.confluenceVersion();
			}).toThrow(new Error("No confluenceVersion is loaded. Use loadConfluenceVersion in a setup function (onPrepare)"));
		});

		it("calls getParamForAJS when loading confluence version", () => {
			expect(confluenceBase.loadConfluenceVersion()).toBeDefined();
			expect(confluenceBase.getParamFromAJS).toHaveBeenCalledWith("versionNumber");
		});

		it("caches the value after async method is resolved", (done: DoneFn) => {
			confluenceBase.loadConfluenceVersion().then((confluenceVersionAsyncResult) => {
				const confluenceVersion = confluenceBase.confluenceVersion();
				expect(confluenceVersion).toBeDefined();
				expect(confluenceVersion).toEqual(confluenceVersionAsyncResult);
				done();
			}).catch((error: Error) => {
				done.fail(error);
			});
		});
	});

	it("has confluence version", () => {
		expect(confluenceBase.confluenceVersion()).toBeDefined();

		if (process.env.CONFLUENCE_VERSION) {
			expect(confluenceBase.confluenceVersion()).toEqual(Version.parse(process.env.CONFLUENCE_VERSION));
		} else {
			console.warn("No environment variable CONFLUENCE_VERSION set");
		}
	});

	describe("openAdminPage", () => {
		beforeEach(screenshotReporter.enable);

		afterAll(() => {
			confluenceBase.logout();
		});

		it("opens admin page", () => {
			confluenceBase.openAdminPage();
			expect(browser.getTitle()).toEqual(confluenceConfig.ADMIN_TITLE);
		});

		it("logs in the admin users", () => {
			confluenceBase.openAdminPage();
			expect(confluenceBase.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});

		it("opens a specific admin if specified", () => {
			const generalAdminAction = "admin/viewgeneralconfig.action";
			confluenceBase.openAdminPage(generalAdminAction);
			expect(browser.getCurrentUrl()).toContain(generalAdminAction);
		});

	});

});
