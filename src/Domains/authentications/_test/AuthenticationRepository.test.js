const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository Interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// Arrange
		const authenticationRepository = new AuthenticationRepository();

		// Action and Assert
		await expect(authenticationRepository.addRefreshToken({})).rejects.toThrowError('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
		await expect(authenticationRepository.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
		await expect(authenticationRepository.deleteRefreshToken('')).rejects.toThrowError('AUTHENTICATION.METHOD_NOT_IMPLEMENTED');
	});
});
