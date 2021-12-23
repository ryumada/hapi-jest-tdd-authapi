/* eslint-disable no-unused-vars */
class AuthenticationRepository {
	async addRefreshToken(token) {
		throw new Error('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
	}

	async verifyRefreshToken(token) {
		throw new Error('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
	}

	async deleteRefreshToken(token) {
		throw new Error('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = AuthenticationRepository;
