const PasswordHash = require('../../Applications/security/PasswordHash');

class BcryptPasswordHash extends PasswordHash {
	constructor(bcrypt, saltRound = 10) {
		super();
		this._bcrypt = bcrypt;
		this._saltRound = saltRound;
	}

	async hash(password) {
		return this._bcrypt.hash(password, this._saltRound);
	}

	compare(plainPassword, hashedPassword) {
		return this._bcrypt.compare(plainPassword, hashedPassword);
	}
}

module.exports = BcryptPasswordHash;
