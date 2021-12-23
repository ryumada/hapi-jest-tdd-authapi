const PasswordCompare = require('../../Applications/security/PasswordCompare');

class BcryptPasswordCompare extends PasswordCompare {
	constructor(bcrypt) {
		super();
		this._bcrypt = bcrypt;
	}

	compare(plainPassword, hashedPassword) {
		return this._bcrypt.compare(plainPassword, hashedPassword);
	}
}

module.exports = BcryptPasswordCompare;
