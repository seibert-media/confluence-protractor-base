import {WebElement} from "selenium-webdriver";
import {describe} from "selenium-webdriver/testing";
import {UniversalPluginManager} from "../page-objects/UniversalPluginManager";
import TimeBombLicenses from "../utils/TimeBombLicenses";

function createTestPluginPath(path: string) {
	return require("path").resolve(process.cwd(), __dirname + "/../../test-data/" + path);
}

function fakeUploadPluginInput() {
	const originalSendKeys = WebElement.prototype.sendKeys;

	spyOn(WebElement.prototype, "sendKeys").and.callFake(function(path: string) {
		if (path === testPluginPath) {
			originalSendKeys.call(this, brokenPluginPath);
			// reset spy
			WebElement.prototype.sendKeys = originalSendKeys;
		} else {
			originalSendKeys.call(this, path);
		}
	});
}

const testPluginPath = createTestPluginPath("tutorial-confluence-macro-demo-1.0.0-SNAPSHOT.jar");
const brokenPluginPath = createTestPluginPath("broken-plugin.jar");
const licensedPluginPath = createTestPluginPath("edit-lock-1.0.10.obr");

describe("UniversalPluginManager (page object)", () => {
	const universalPluginManager = new UniversalPluginManager();

	const pluginName = "tutorial-confluence-macro-demo";

	const licensedPluginName = "Edit Lock Plugin for Confluence";

	const PLUGIN_UPLOAD_TIMEOUT = 4 * 60 * 1000;

	beforeAll(() => {
		universalPluginManager.authenticateAsAdmin();
	});

	describe("uploadPlugin()", () => {

		it("installs the plugin", () => {
			universalPluginManager.uploadPlugin(pluginName, testPluginPath, PLUGIN_UPLOAD_TIMEOUT);
			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	/*
	 * Enable these upm tests only for compatible Versions >= 5.9
	 */
	if (universalPluginManager.confluenceVersion().greaterThanEquals("5.9")) {
		describe("disablePlugin()", () => {
			it("disables this plugin", () => {
				universalPluginManager.disablePlugin(pluginName);
				expect(universalPluginManager.pluginEnabled(pluginName)).toBeFalsy();
			});
		});

		describe("enablePlugin()", () => {
			it("enables this plugin", () => {
				universalPluginManager.enablePlugin(pluginName);
				expect(universalPluginManager.pluginEnabled(pluginName)).toBeTruthy();
			});
		});

		describe("License", () => {
			it("adds license to plugin", () => {
				universalPluginManager.uploadPlugin(licensedPluginName, licensedPluginPath, PLUGIN_UPLOAD_TIMEOUT);
				universalPluginManager.addLicense(licensedPluginName, TimeBombLicenses.THREE_HOURS_TIMEBOMB);
				expect(universalPluginManager.pluginLicensed(licensedPluginName)).toBeTruthy();
			}, PLUGIN_UPLOAD_TIMEOUT);
			it("removes license from plugin", () => {
				universalPluginManager.removeLicense(licensedPluginName);
				expect(universalPluginManager.pluginLicensed(licensedPluginName)).toBe(false);
			}, PLUGIN_UPLOAD_TIMEOUT);
		});
	}

	describe("uninstallPlugin()", () => {
		it("uninstalls this plugin", () => {
			universalPluginManager.uninstallPlugin(pluginName);
			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(false);
		}, PLUGIN_UPLOAD_TIMEOUT);
	});

	describe("uploadPlugin() error handling", () => {

		const TIMEOUT_RETRY_FACTOR = 1.5;

		beforeEach(() => {
			universalPluginManager.uninstallPlugin(pluginName);
		});

		it("retries plugin install on fail", () => {
			fakeUploadPluginInput();
			universalPluginManager.uploadPlugin("tutorial-confluence-macro-demo", testPluginPath, PLUGIN_UPLOAD_TIMEOUT);

			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(true);
		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

		it("does not retry the installation if maxAttempts set to 1", () => {
			const maxAttempts = 1;
			fakeUploadPluginInput();

			universalPluginManager.uploadPlugin(pluginName, testPluginPath, PLUGIN_UPLOAD_TIMEOUT, maxAttempts);

			expect(universalPluginManager.pluginInstalled(pluginName)).toBe(false);

		}, PLUGIN_UPLOAD_TIMEOUT * TIMEOUT_RETRY_FACTOR);

	});

});
