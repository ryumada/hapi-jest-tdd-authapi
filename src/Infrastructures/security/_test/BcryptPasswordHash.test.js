const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
	describe('hash function', () => {
		it('should encrypt password correctly', async () => {
			// Arrange
			const spyHash = jest.spyOn(bcrypt, 'hash');
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

			// Action
			const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

			// Assert
			expect(typeof encryptedPassword).toEqual('string');
			expect(encryptedPassword).not.toEqual('plain_password');
			expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
		});
	});

	describe('compare function', () => {
		it('should compare the password correctly', async () => {
			// Arrange
			const spyCompare = jest.spyOn(bcrypt, 'compare');
			const bcryptPasswordHash = new BcryptPasswordHash(bcrypt, 10);
			const hashedPassword = await bcryptPasswordHash.hash('plain_password');

			// Action
			const isMatch = await bcryptPasswordHash.compare('plain_password', hashedPassword);

			// Assert
			expect(isMatch).toEqual(true);
			expect(spyCompare).toBeCalledWith('plain_password', hashedPassword);
		});
	});
});
