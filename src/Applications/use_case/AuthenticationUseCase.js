const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class AuthenticationUseCase {
	constructor({authenticationRepository, userRepository, passwordHash, authTokenManager}) {
		this._authenticationRepository = authenticationRepository;
		this._userRepository = userRepository;
		this._passwordHash = passwordHash;
		this._authTokenManager = authTokenManager;
	}

	async addNewAuthentication(payload) {
		const newAuth = new NewAuth(payload);
		const {id, password: hashedPassword} = await this._userRepository.getUser(newAuth.username);

		if (!await this._passwordHash.compare(newAuth.password, hashedPassword)) {
			throw new Error('AUTHENTICATION_USE_CASE.PASSWORD_MISMATCH');
		}

		const accessToken = this._authTokenManager.generateAccessToken({id});
		const refreshToken = this._authTokenManager.generateRefreshToken({id});
		await this._authenticationRepository.addRefreshToken(refreshToken);

		return {accessToken, refreshToken};
	}

	async refreshAuthentication({refreshToken}) {
		this.verifyRefreshToken(refreshToken);

		await this._authenticationRepository.verifyRefreshToken(refreshToken);
		await this._authTokenManager.verifyRefreshToken(refreshToken);

		return this._authTokenManager.generateAccessToken(refreshToken);
	}

	async deleteAuthentication({refreshToken}) {
		this.verifyRefreshToken(refreshToken);

		await this._authenticationRepository.verifyRefreshToken(refreshToken);
		await this._authTokenManager.verifyRefreshToken(refreshToken);

		await this._authenticationRepository.deleteRefreshToken(refreshToken);
	}

	verifyRefreshToken(refreshToken) {
		if (!refreshToken) {
			throw new Error('AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
		}

		if (typeof refreshToken !== 'string') {
			throw new Error('AUTHENTICATION_USE_CASE.REFRESH_TOKEN_MUST_BE_A_STRING');
		}
	}
}

module.exports = AuthenticationUseCase;
