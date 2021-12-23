const AuthTokenManager = require('../AuthTokenManager');

describe('AuthTokenManager interface', () => {
	// Arrange
	const payload = {
		id: 'ryumada',
	};
	const authTokenManager = new AuthTokenManager();

	it('should throw error when invoke generateAccessToken function', () => {
		// Action & Assert
		expect(() => authTokenManager.generateAccessToken(payload)).toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	});

	it('should throw error when invoke generateRefreshToken function', () => {
		// Action & Assert
		expect(() => authTokenManager.generateRefreshToken(payload)).toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	});

	it('should throw error when invoke verifyRefreshToken function', () => {
		// Arrange
		const refreshToken = 'refreshToken-string';

		// Action & Assert
		expect(() => authTokenManager.verifyRefreshToken(refreshToken)).toThrowError('AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
	});
});
