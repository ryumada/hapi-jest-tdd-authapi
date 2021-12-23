const bcrypt = require('bcrypt');
const BcryptPasswordCompare = require('../BcryptPasswordCompare');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordCompare', () => {
	describe('compare function', () => {
		it('should compare the password correctly', async () => {
			// Arrange
			const spyCompare = jest.spyOn(bcrypt, 'compare');
			const bcryptPasswordCompare = new BcryptPasswordCompare(bcrypt);
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt, 10);
			const hashedPassword = await bcryptPasswordHash.hash('plain_password');

			// Action
			const isMatch = await bcryptPasswordCompare.compare('plain_password', hashedPassword);

			// Assert
			expect(isMatch).toEqual(true);
			expect(spyCompare).toBeCalledWith('plain_password', hashedPassword);
		});
	});
});
