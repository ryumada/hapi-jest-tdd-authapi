const AuthenticationError = require('./AuthenticationError');
const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
	translate(error) {
		return DomainErrorTranslator._directories[error.message] || error;
	},
};

DomainErrorTranslator._directories = {
	'ADD_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dibutuhkan untuk autentikasi tidak ada'),
	'ADD_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat melakukan autentikasi karena properti yang diberikan memiliki tipe data yang terlarang'),
	'AUTHENTICATION_USE_CASE.PASSWORD_MISMATCH': new AuthenticationError('password yang anda masukkan salah'),
	'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
	'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
	'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
	'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
};

module.exports = DomainErrorTranslator;
