import {browser} from "protractor";
import {ConfluenceLogin} from "../page-objects/ConfluenceLogin";

const pageObjectUtils = require("../utils/pageObjectUtils").pageObjectUtils;

describe("ConfluenceLogin (page object)", () => {

	const confluenceLogin = new ConfluenceLogin();
	beforeAll(() => {
		confluenceLogin.logout();
	});

	const confluenceConfig = confluenceLogin.confluenceConfig();

	describe("loginAsAdmin", () => {
		beforeEach(() => {
			confluenceLogin.loginAsAdmin();
		});

		afterEach(() => {
			confluenceLogin.logout();
		});

		it("opens the dashboard", () => {
			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it("logs in the admin users", () => {
			expect(confluenceLogin.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});
	});

	describe("login() with test user", () => {
		const testUser = confluenceConfig.USERS.TEST_USER;

		beforeEach(() => {
			confluenceLogin.login(testUser.USERNAME, testUser.PASSWORD);
		});

		afterEach(() => {
			confluenceLogin.logout();
		});

		it("logs in the test users", () => {
			expect(confluenceLogin.currentUsername()).toBe(testUser.USERNAME);
		});

		it("opens dashboard", () => {
			expect(browser.getTitle()).toEqual(confluenceConfig.DASHBOARD_TITLE);
		});

		it("switches the user without logout", () => {
			confluenceLogin.loginAsAdmin();
			expect(confluenceLogin.currentUsername()).toBe(confluenceConfig.USERS.ADMIN.USERNAME);
		});
	});

});
