	import {browser, by, element, ExpectedConditions} from "protractor";
	import {pageObjectUtils} from "../utils/pageObjectUtils";
	import {ConfluenceAction} from "./ConfluenceAction";
	import {ConfluenceBase} from "./ConfluenceBase";

	const remote = require("selenium-webdriver/remote");
	const path = require("path");
	const clickIfPresent = pageObjectUtils.clickIfPresent;
	const waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
	const asyncElement = pageObjectUtils.asyncElement;

	const DEFAULT_PLUGIN_UPLOAD_TIMEOUT = 60 * 1000;
	const DEFAULT_UPM_LOADING_TIME = 20 * 1000;
	const UPLOAD_BUTTON_VISIBILITY_TIMEOUT = 5000;
	const DEFAULT_MAX_ATTEMPTS = 2;

	export class UniversalPluginManager extends ConfluenceBase {

		public upmAction = new ConfluenceAction({
			path: "plugins/servlet/upm",
		});

		constructor() {
			super();
			browser.setFileDetector(new remote.FileDetector());
		}

		public pluginInstalled(pluginName: string): Promise<boolean> {
			const EC = ExpectedConditions;

			this.upmAction.open({refreshAlways: true});

			element(by.id("upm-manage-filter-box")).sendKeys(pluginName);

			browser.wait(EC.visibilityOf(element(by.css(".upm-plugin-list-container"))), DEFAULT_UPM_LOADING_TIME);

			const pluginNameElement = pageObjectUtils.findFirstDisplayed(by.css(".upm-plugin-name"));

			return EC.textToBePresentInElement(pluginNameElement, pluginName)();
		}

		public uploadPlugin(pluginName: string, fileToUpload: string, timeout = DEFAULT_PLUGIN_UPLOAD_TIMEOUT, maxAttempts = DEFAULT_MAX_ATTEMPTS) {

			this.uploadPluginInternal(pluginName, fileToUpload, timeout, maxAttempts);
		}

		public uninstallPlugin(pluginKey: string) {
			this.pluginInstalled(pluginKey).then((isPluginInstalled) => {
				if (isPluginInstalled) {
					pageObjectUtils.findFirstDisplayed(by.css(".upm-plugin")).click();

					if (this.confluenceVersion().greaterThan("5.8")) {
						asyncElement(by.css('[data-action="UNINSTALL"]')).click();
						clickIfPresent(asyncElement(by.css("button.confirm")));
					} else {
						const uninstallButton = element(by.css(".upm-uninstall"));
						browser.wait(ExpectedConditions.visibilityOf(uninstallButton));
						uninstallButton.click();
						clickIfPresent(asyncElement(by.css("#upm-confirm-dialog .button-panel-button")));
					}
				}
			});
		}

		public parseMavenVersionFromPom(): string {
			const mavenCommand = "atlas-mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate " +
				"-Dexpression=project.version -B";
			const mavenVersionOutput = require("child_process").execSync(mavenCommand, {
				encoding: "utf-8",
				stdio: [0],
			});

			const mavenVersionLine = mavenVersionOutput.split("\n").filter((outputLine: string) => {
				// expect version line to match number and dot "1."
				return /^\d+\..*$/.test(outputLine.trim());
			});

			if (mavenVersionLine.length !== 1) {
				throw new Error("Expected one line of maven output to be the version but found " + mavenVersionLine.length);
			}

			return mavenVersionLine[0].trim();
		}

		public disablePlugin(pluginName: string) {
			const EC = ExpectedConditions;
			this.openPlugin(pluginName);
			const disableBtn = element(by.css(".upm-plugin-actions [data-action=DISABLE]"));
			browser.wait(EC.visibilityOf(disableBtn));
			disableBtn.click();
		}

		public enablePlugin(pluginName: string) {
			const EC = ExpectedConditions;
			this.openPlugin(pluginName);
			const enableBtn = element(by.css(".upm-plugin-actions [data-action=ENABLE]"));
			browser.wait(EC.visibilityOf(enableBtn));
			enableBtn.click();
		}

		public pluginEnabled(pluginName: string): Promise<boolean> {
			const EC = ExpectedConditions;
			this.openPlugin(pluginName);
			browser.wait(EC.visibilityOf(element(by.css(".upm-plugin-info"))));
			const disableBtn = element(by.css(".upm-plugin-actions [data-action=DISABLE]"));
			return EC.visibilityOf(disableBtn)();
		}

    public pluginLicensed(pluginName: string): Promise<boolean> {
      const EC = ExpectedConditions;
      this.openPlugin(pluginName);
      browser.wait(EC.visibilityOf(element(by.css(".upm-plugin-details"))));
      return EC.visibilityOf(element(by.css(".upm-plugin-license-status-label")))();
    }

		public addLicense(pluginName: string, licenseKey: string) {
			const EC = ExpectedConditions;
			this.openPlugin(pluginName);
			const licenseEditTextarea = element(by.css("textarea.edit-license-key"));
			browser.wait(EC.visibilityOf(licenseEditTextarea));
			licenseEditTextarea.clear();
			licenseEditTextarea.sendKeys(licenseKey);
			const licenseSubmitBtn = element(by.css("input.submit"));
			licenseSubmitBtn.click();
		}

		public removeLicense(pluginName: string) {
			const EC = ExpectedConditions;
			this.openPlugin(pluginName);
			const licenseEditBtn = element(by.css(".upm-plugin-license-edit"));
			browser.wait(EC.visibilityOf(licenseEditBtn));
			licenseEditBtn.click();
			const licenseEditTextarea = element(by.css("textarea.edit-license-key"));
			browser.wait(EC.visibilityOf(licenseEditTextarea));
			licenseEditTextarea.clear();
			const licenseSubmitBtn = element(by.css("input.submit"));
			licenseSubmitBtn.click();
		}

		private openPlugin(pluginName: string) {
			const EC = ExpectedConditions;
			this.upmAction.open({refreshAlways: true});
			element(by.id("upm-manage-filter-box")).sendKeys(pluginName);
			browser.wait(EC.visibilityOf(element(by.css(".upm-plugin-list-container"))), DEFAULT_UPM_LOADING_TIME);
			const pluginNameElement = pageObjectUtils.findFirstDisplayed(by.css(".upm-plugin-name"));
			pluginNameElement.click();
			return EC.visibilityOf(element(by.css(".upm-plugin-info")))();
		}

		private uploadPluginInternal(
			pluginName: string,
			fileToUpload: string,
			timeout = DEFAULT_PLUGIN_UPLOAD_TIMEOUT,
			maxAttempts = DEFAULT_MAX_ATTEMPTS,
			attemptCount = 1) {
			this.disableNotifications();

			this.upmAction.open({refreshAlways: true});

			// open upload dialog
			const uploadButton = asyncElement(by.id("upm-upload"));
			uploadButton.click().then(() => {
				// passed, do nothing
			}, (err) => {
				console.log("error opening upload plugin button:", err);
				this.skipNotifications();
				uploadButton.click();
			});

			// get path and upload plugin
			const absolutePath = path.resolve(process.cwd(), fileToUpload);
			// check if file exists
			require("fs").accessSync(absolutePath);

			asyncElement(by.id("upm-upload-file")).sendKeys(absolutePath);

			// try upload buttons for different confluence versiions
			clickIfPresent(asyncElement(by.css("button.confirm")));
			clickIfPresent(asyncElement(by.css("button.upm-upload-plugin-submit")));

			const pluginNameElement = element(by.css(".plugin-name"));
			const pluginInstalledCondition = ExpectedConditions.visibilityOf(pluginNameElement);
			const pluginInstallFailCondition = ExpectedConditions.visibilityOf(element(by.css(".aui-message.error")));

			browser.wait(ExpectedConditions.or(pluginInstalledCondition, pluginInstallFailCondition)).then(() => {
				if (attemptCount < maxAttempts) {
					// TODO: EC#visibilityOf simply returns Function as typing. Add scaffolding to make it into () => Promise?<boolean> to get rid of this explicit any
					pluginInstallFailCondition().then((installFailed: any) => {
						if (installFailed) {
							this.uploadPluginInternal(pluginName, fileToUpload, timeout, maxAttempts, attemptCount + 1);
						}
					});
				}

				// try cancel buttons for different confluence versions
				clickIfPresent(asyncElement(by.css("button.button.aui-button-link.cancel")));
				clickIfPresent(asyncElement(by.css("button.button-panel-cancel-link")));
			});
		}

	}
