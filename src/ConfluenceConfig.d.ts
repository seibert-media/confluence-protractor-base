interface ConfluenceConfig {
	DASHBOARD_TITLE: string;
	ADMIN_TITLE: string;
	USERS: {
		ADMIN: {
			USERNAME: string,
			PASSWORD: string,
		},
		TEST_USER: {
			USERNAME: string,
			PASSWORD: string,
		},
	};
}
