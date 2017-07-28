export class Version {
	public static compare(versionA, versionB) {
		versionA = Version.parse(versionA);
		versionB = Version.parse(versionB);

		const majorCompare = versionA.major - versionB.major;
		const minorCompare = versionA.minor - versionB.minor;
		const patchCompare = versionA.patch - versionB.patch;

		if (majorCompare !== 0 || isNaN(minorCompare)) {
			return majorCompare;
		}

		if (minorCompare !== 0 || isNaN(patchCompare)) {
			return minorCompare;
		}

		return patchCompare;
	}

	public static parse(version) {
		if (version instanceof Version) {
			return new Version(version.version, version.major, version.minor, version.patch);
		}
		if (!version) {
			throw new Error("Parameter version in Version.parse must be defined");
		}

		version = ALLOWED_SUFFIXES.reduce((versionString, allowedSuffexRegex) => {
			return versionString.replace(allowedSuffexRegex, "");
		}, version);

		const versionSplit = version.split(".");
		const major = checkNumberStringAndDefault(versionSplit[0]);
		const minor = checkNumberStringAndDefault(versionSplit[1]);
		const patch = checkNumberStringAndDefault(versionSplit[2]);

		return new Version(version, major, minor, patch);
	}

	private version: string;
	private major: number;
	private minor: number;
	private patch: number;

	constructor(version: string, major?: number, minor?: number, patch?: number) {
		this.version = version;
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}

	public toString() {
		return this.version;
	}

	public equals(otherVersion) {
		return Version.compare(this, otherVersion) === 0;
	}

	public lessThan(otherVersion) {
		return Version.compare(this, otherVersion) < 0;
	}

	public lessThanEquals(otherVersion) {
		return Version.compare(this, otherVersion) <= 0;
	}

	public greaterThan(otherVersion) {
		return Version.compare(this, otherVersion) > 0;
	}

	public greaterThanEquals(otherVersion) {
		return Version.compare(this, otherVersion) >= 0;
	}
}

const ALLOWED_SUFFIXES = [
	/-rc\d+$/,
	/-beta\d+$/,
	/-m\d+$/,
];

function checkNumberStringAndDefault(versionPart: string): number {
	if (!versionPart) {
		return undefined;
	}
	if (!/^\d+$/.test(versionPart)) {
		throw new Error("Version must only contain numbers or allowed suffixes (-rc, -beta), but found: " + versionPart);
	}
	return parseInt(versionPart, 10);
}
