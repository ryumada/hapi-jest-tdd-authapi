const PasswordCompare = require('../PasswordCompare');

describe('PasswordCompare interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// Arrange
		const passwordCompare = new PasswordCompare();

		// Action & Assert
		await expect(passwordCompare.compare('dummy_password')).rejects.toThrowError('PASSWORD_COMPARE.METHOD_NOT_IMPLEMENTED');
	});
});
