const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtAuthTokenManager = require('../JwtAuthTokenManager');

describe('JwtAuthTokenManager', () => {
	describe('generateAccessToken function', () => {
		it('should generate accessToken correctly', () => {
			// Arrange
			const payload = {
				id: 'user-1234567890123456',
			};
			const spyGenerateAccessToken = jest.spyOn(Jwt.token, 'generate');
			const jwtAuthTokenManager = new JwtAuthTokenManager(Jwt);

			// Action
			const accessToken = jwtAuthTokenManager.generateAccessToken(payload);

			expect(typeof accessToken).toEqual('string');
			expect(spyGenerateAccessToken).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
		});
	});

	describe('generateRefreshToken function', () => {
		it('should generate refreshToken correctly', () => {
			// Arrange
			const payload = {
				id: 'user-1234567890123456',
			};
			const spyGenerateRefreshToken = jest.spyOn(Jwt.token, 'generate');
			const jwtAuthTokenManager = new JwtAuthTokenManager(Jwt);

			// Action
			const refreshToken = jwtAuthTokenManager.generateRefreshToken(payload);

			expect(typeof refreshToken).toEqual('string');
			expect(spyGenerateRefreshToken).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
		});
	});

	describe('verifyRefreshToken function', () => {
		it('should throw InvariantError when the refreshToken is not valid', () => {
			// Arrange
			/* spell-checker: disable */
			const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJ5dW1hZGEiLCJpYXQiOjE1MTYyMzkwMjJ9.hjtPnhUF8M-TSpsc4_Fgt5POM8thdTo7XssjQfjL8ZI';
			const jwtAuthTokenManager = new JwtAuthTokenManager(Jwt);

			// Action & Assert
			expect(() => jwtAuthTokenManager.verifyRefreshToken(dummyToken)).toThrowError(InvariantError);
		});

		it('should verify the refreshToken correctly', () => {
			// Arrange
			const jwtAuthTokenManager = new JwtAuthTokenManager(Jwt);
			const payload = {
				id: 'user-1234567890123456',
			};
			const refreshToken = jwtAuthTokenManager.generateRefreshToken(payload);
			const artifacts = Jwt.token.decode(refreshToken);

			/** Spy?! */
			const spyJwtDecode = jest.spyOn(Jwt.token, 'decode');
			const spyJwtVerify = jest.spyOn(Jwt.token, 'verifySignature');

			// Action
			const decodedPayload = jwtAuthTokenManager.verifyRefreshToken(refreshToken);

			// Assert
			expect(decodedPayload.id).toStrictEqual(payload.id);
			expect(spyJwtDecode).toBeCalledWith(refreshToken);
			expect(spyJwtVerify).toBeCalledWith(artifacts, process.env.REFRESH_TOKEN_KEY);
		});
	});
});
