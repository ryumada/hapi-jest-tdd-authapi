const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../../Infrastructures/database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
	afterEach(async () => {
		await AuthenticationsTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addRefreshToken function', () => {
		it('should add the refreshToken to the database correctly', async () => {
			// Arrange
			const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

			// Action
			await authenticationRepositoryPostgres.addRefreshToken('some-dummy-token');
			const result = await AuthenticationsTableTestHelper.findToken('some-dummy-token');

			// Assert
			expect(result[0].token).toEqual('some-dummy-token');
		});
	});

	describe('verifyRefreshToken function', () => {
		it('should verify the refreshToken correctly', async () => {
			// Arrange
			await AuthenticationsTableTestHelper.addToken('some-dummy-token');
			const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

			// Action & Assert
			await expect(authenticationRepositoryPostgres.verifyRefreshToken('some-dummy-token')).resolves.not.toThrowError(InvariantError);
		});

		it('should throw InvariantError when the token not found in the database', async () => {
			// Arrange
			const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

			// Action & Assert
			await expect(authenticationRepositoryPostgres.verifyRefreshToken('some-dummy-token')).rejects.toThrowError(InvariantError);
		});
	});

	describe('deleteRefreshToken function', () => {
		it('should delete the refreshToken correctly', async () => {
			// Arrange
			await AuthenticationsTableTestHelper.addToken('some-dummy-token');
			const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

			// Action & Assert
			await expect(authenticationRepositoryPostgres.deleteRefreshToken('some-dummy-token')).resolves.not.toThrowError(Error);
		});
	});
});
