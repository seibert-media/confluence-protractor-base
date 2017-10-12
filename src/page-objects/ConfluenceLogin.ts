import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";

import {browser, by, element} from "protractor";
import {ConfluenceAction} from "./ConfluenceAction";
import Promise = promise.Promise;

const assert = pageObjectUtils.assert;
const clickIfPresent = pageObjectUtils.clickIfPresent;
const openPage = pageObjectUtils.openPage;
const asyncElement = pageObjectUtils.asyncElement;

export interface LoginActions {
	authenticate: ConfluenceAction;
	login: ConfluenceAction;
	logout: ConfluenceAction;
}

export class ConfluenceLogin {
	public confluenceConfig: () => any; // TODO: Better type
	public actions: LoginActions = {
		authenticate: new ConfluenceAction({
			path: "authenticate.action",
		}),
		login: new ConfluenceAction({
			path: "login.action",
		}),
		logout: new ConfluenceAction({
			path: "logout.action",
		}),
	};

	constructor() {
		this.confluenceConfig = require("../loadConfluenceConfig").loadConfluenceConfig;
	}

	public login(username?: string, password?: string) {
		username = username || this.testUser().USERNAME;
		password = password || this.testUser().PASSWORD;

		this.currentUsername().then((currentUsername) => {
			if (username === currentUsername) {
				// user is already logged in: redirect to dashboard
				return;
			}

			if (currentUsername !== "") {
				console.log("Logged in with wrong user (" + currentUsername + "). Switch to: " + username);
				// logout if logged in with wrong user
				this.actions.logout.open();
			}

			this.actions.login.open({ignoreSearch: true});

			asyncElement(by.name("os_username")).sendKeys(username);
			asyncElement(by.name("os_password")).sendKeys(password);

			const loginButton = asyncElement(by.id("loginButton")); // pageObjectUtils.logPromise(loginButton.isPresent());
			loginButton.click();

			assert(asyncElement(by.css("#captcha-container")).isPresent(), false, "Captcha required. Log in manually once.");

			browser.getCurrentUrl().then((url) => {
				if (url.endsWith("plugins/termsofuse/agreement.action")) {
					console.warn('Confirm terms of use for  "' + username + '" (possibly dependent from plugin version)');
					this.confirmTermsOfUse();
				}
			});

			browser.getCurrentUrl().then((url) => {
				if (url.endsWith("welcome.action")) {
					console.warn('Try to skip welcome.action for "' + username + '" (possibly dependent from confluence version)');
					this.skipWelcomeProcedure();
				}
			});
		});
	}

	public authenticate(password?: string) {
		password = password || this.testUser().PASSWORD;

		// authenticate
		this.actions.authenticate.open();

		asyncElement(by.name("password")).sendKeys(password);
		asyncElement(by.name("authenticate")).click();
	}

	public loginAsAdmin() {
		this.login(this.admin().USERNAME, this.admin().PASSWORD);
	}

	public authenticateAsAdmin() {
		this.loginAsAdmin();

		this.authenticate(this.admin().PASSWORD);
	}

	public currentUsername() {
		return this.getParamFromAJS("remoteUser", "");
	}

	public getParamFromAJS(paramName: string, defaultValue?: any): Promise<string> {
		return browser.executeScript(() => {
			// tslint:disable-next-line
			if (!window["AJS"] || !window["AJS"].params) {
				return {};
			}
			// tslint:disable-next-line
			return window["AJS"].params;
		}).then((params) => params[paramName] || defaultValue);
	}

	public logout() {
		this.actions.logout.open();
	}

	private skipWelcomeProcedure() {
		// skip welcome message
		clickIfPresent(asyncElement(by.id("grow-intro-welcome-start")));

		// skip video
		clickIfPresent(asyncElement(by.id("grow-intro-video-skip-button")));

		// skip picture
		clickIfPresent(asyncElement(by.css('[data-action="skip"]')));

		// select space
		clickIfPresent(element.all(by.css(".space-checkbox input.checkbox")).first());
		clickIfPresent(asyncElement(by.css(".intro-find-spaces-button-continue")));

		// reload dashboard
		openPage();
	}

	private confirmTermsOfUse() {
		clickIfPresent(asyncElement(by.css('form[action="/plugins/termsofuse/agreement.action"] input[type="submit"]')));

		// reload dashboard
		openPage();
	}

	private testUser() {
		return this.confluenceConfig().USERS.TEST_USER;
	}

	private admin() {
		return this.confluenceConfig().USERS.ADMIN;
	}

}
