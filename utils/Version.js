function Version(version, major, minor, patch) {
	this.version = version;
	this.major = major;
	this.minor = minor;
	this.patch = patch;
}

var ALLOWED_SUFFIXES = [
	/-rc\d+$/,
	/-beta\d+$/
];

Version.prototype.toString = function () {
	return this.version;
};

Version.prototype.equals = function (otherVersion) {
	return Version.compare(this, otherVersion) === 0;
};

Version.prototype.lessThan = function (otherVersion) {
	return Version.compare(this, otherVersion) < 0;
};

Version.prototype.lessThanEquals = function (otherVersion) {
	return Version.compare(this, otherVersion) <= 0;
};

Version.prototype.greaterThan = function (otherVersion) {
	return Version.compare(this, otherVersion) > 0;
};

Version.prototype.greaterThanEquals = function (otherVersion) {
	return Version.compare(this, otherVersion) >= 0;
};

function checkNumberStringAndDefault(versionPart) {
	if (!versionPart) {
		return undefined;
	}
	if (!/^\d+$/.test(versionPart)) {
		throw new Error('Version must only contain numbers or allowed suffixes (-rc, -beta), bus found: ' + versionPart);
	}
	return parseInt(versionPart, 10);
}

Version.compare = function (versionA, versionB) {
	versionA = Version.parse(versionA);
	versionB = Version.parse(versionB);

	var majorCompare = versionA.major - versionB.major;
	var minorCompare = versionA.minor - versionB.minor;
	var patchCompare = versionA.patch - versionB.patch;

	if (majorCompare !== 0 || isNaN(minorCompare)) {
		return majorCompare;
	}

	if (minorCompare !== 0 || isNaN(patchCompare)) {
		return minorCompare;
	}

	return patchCompare;
};


Version.parse = function (version) {
	if (version instanceof Version) {
		return new Version(version.version, version.major, version.minor, version.patch);
	}
	if (!version) {
		throw new Error('Parameter version in Version.parse must be defined');
	}

	version = ALLOWED_SUFFIXES.reduce(function (versionString, allowedSuffexRegex) {
		return versionString.replace(allowedSuffexRegex, "");
	}, version);

	var versionSplit = version.split('.');
	var major = checkNumberStringAndDefault(versionSplit[0]);
	var minor = checkNumberStringAndDefault(versionSplit[1]);
	var patch = checkNumberStringAndDefault(versionSplit[2]);

	return new Version(version, major, minor, patch);
};

module.exports = Version;
