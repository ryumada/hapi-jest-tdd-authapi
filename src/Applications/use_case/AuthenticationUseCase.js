const AddAuthentication = require('../../Domains/authentications/entities/AddAuthentication');

class AuthenticationUseCase {
	constructor({authenticationRepository, userRepository, passwordCompare, authTokenManager}) {
		this._authenticationRepository = authenticationRepository;
		this._userRepository = userRepository;
		this._passwordCompare = passwordCompare;
		this._authTokenManager = authTokenManager;
	}

	async addNewAuthentication(payload) {
		const addAuthentication = new AddAuthentication(payload);
		const {id, password: hashedPassword} = await this._userRepository.getUser(addAuthentication.username);

		if (!await this._passwordCompare.compare(addAuthentication.password, hashedPassword)) {
			throw new Error('AUTHENTICATION_USE_CASE.PASSWORD_MISMATCH');
		}

		const accessToken = this._authTokenManager.generateAccessToken({id});
		const refreshToken = this._authTokenManager.generateRefreshToken({id});
		await this._authenticationRepository.addRefreshToken(refreshToken);

		return {accessToken, refreshToken};
	}

	async refreshAuthentication({refreshToken}) {
		if (typeof refreshToken !== 'string') {
			throw new Error('AUTHENTICATION_USE_CASE.REFRESH_TOKEN_MUST_BE_A_STRING');
		}

		await this._authenticationRepository.verifyRefreshToken(refreshToken);
		await this._authTokenManager.verifyRefreshToken(refreshToken);

		return this._authTokenManager.generateAccessToken(refreshToken);
	}

	async deleteAuthentication({refreshToken}) {
		if (typeof refreshToken !== 'string') {
			throw new Error('AUTHENTICATION_USE_CASE.REFRESH_TOKEN_MUST_BE_A_STRING');
		}

		await this._authenticationRepository.verifyRefreshToken(refreshToken);
		await this._authTokenManager.verifyRefreshToken(refreshToken);

		await this._authenticationRepository.deleteRefreshToken(refreshToken);
	}
}

module.exports = AuthenticationUseCase;
