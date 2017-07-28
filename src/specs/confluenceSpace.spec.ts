import {ConfluenceSpace} from "../page-objects/ConfluenceSpace";
import {confluenceSpaceTestUtils} from "../utils/confluenceSpaceTestUtils";

describe("ConfluenceSpace (page object)", () => {

	const demonstrationSpace = new ConfluenceSpace("ds", "Demonstration Space");
	beforeAll(() => {
		demonstrationSpace.authenticateAsAdmin();
	});

	describe("assertSpaceExists", () => {
		const notExistingSpace = new ConfluenceSpace("NOT_EXISTING_SPACE_KEY", "Not existing space");

		it("detects existing space", () => {
			demonstrationSpace.assertSpaceExists();
		});

		it("detects NOT existing space", () => {
			notExistingSpace.assertSpaceExistsNot();
		});
	});

	describe("spacePermissions", () => {
		describe('for "confluence-users" group', () => {
			const confluenceUsersPermissionsAsMap = {
				viewspace: true,
				removeowncontent: true,
				editspace: true,
				removepage: true,
				editblog: true,
				removeblog: true,
				createattachment: true,
				removeattachment: true,
				comment: true,
				removecomment: true,
				setpagepermissions: true,
				removemail: true,
				exportspace: true,
				setspacepermissions: false,
			};

			const group = "confluence-users";
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceUsersPermissionsAsMap, group);
		});

		describe('for "confluence-administrators" group', () => {
			const confluenceAdministratorsPermissionsAsList = [
				"viewspace",
				"removeowncontent",
				"editspace",
				"removepage",
				"editblog",
				"removeblog",
				"createattachment",
				"removeattachment",
				"comment",
				"removecomment",
				"setpagepermissions",
				"removemail",
				"exportspace",
				"setspacepermissions",
			];

			const group = "confluence-administrators";
			confluenceSpaceTestUtils.testGroupPermissions(demonstrationSpace, confluenceAdministratorsPermissionsAsList, group);
		});

		describe("anonymous user", () => {
			const anonymousPermissionsAsList = [
				"viewspace",
				"removeowncontent",
				"editspace",
				"removepage",
				"editblog",
				"removeblog",
				"createattachment",
				"removeattachment",
				"comment",
				"removecomment",
				"removemail",
				"exportspace",
			];

			confluenceSpaceTestUtils.testAnonymousPermissions(demonstrationSpace, anonymousPermissionsAsList);
		});
	});

	describe("create() and remove() as non admin user", () => {
		const adarasTestSpace = new ConfluenceSpace("ADARA", "Adara's Test Space");

		beforeEach(() => {
			adarasTestSpace.login();
		});

		it("creates a space", () => {
			adarasTestSpace.create();
		});

		it("has ADARA space", () => {
			adarasTestSpace.waitForSpaceToAppearInSpaceDirectory();
		});

		describe("spacePermissions", () => {
			describe('for "confluence-users" group', () => {
				const confluenceUsersPermissionsAsList = [
					"viewspace",
					"removeowncontent",
					"editspace",
					"editblog",
					"createattachment",
					"comment",
					"exportspace",
				];

				const group = "confluence-users";
				confluenceSpaceTestUtils.testGroupPermissions(adarasTestSpace, confluenceUsersPermissionsAsList, group);
			});

			describe("creator user permissions (Adara.Moss)", () => {

				const creatorUserPermissionsAsList = [
					"viewspace",
					"removeowncontent",
					"editspace",
					"removepage",
					"editblog",
					"removeblog",
					"createattachment",
					"removeattachment",
					"comment",
					"removecomment",
					"setpagepermissions",
					"removemail",
					"exportspace",
					"setspacepermissions",
				];

				const username = "Adara.Moss";
				confluenceSpaceTestUtils.testUserPermissions(adarasTestSpace, creatorUserPermissionsAsList, username);
			});

			describe("anonymous user", () => {

				const anonymousPermissionsAsList = [];

				confluenceSpaceTestUtils.testAnonymousPermissions(adarasTestSpace, anonymousPermissionsAsList);
			});
		});

		it("removes a space", () => {
			adarasTestSpace.authenticate();
			adarasTestSpace.remove();
		});

		it("has no ADARA space anymore", () => {
			adarasTestSpace.waitForSpaceToDisappearFromSpaceDirectory();
		});
	});
});
