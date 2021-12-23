const AuthTokenManager = require('../../Applications/security/AuthTokenManager');

const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtAuthTokenManager extends AuthTokenManager {
	constructor(jwt) {
		super();
		this._jwt = jwt;
	}

	generateAccessToken(payload) {
		return this._jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
	}

	generateRefreshToken(payload) {
		return this._jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
	}

	verifyRefreshToken(refreshToken) {
		try {
			const artifacts = this._jwt.token.decode(refreshToken);
			this._jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
			const {payload} = artifacts.decoded;
			return payload;
		} catch {
			throw new InvariantError('Refresh Token tidak valid');
		}
	}
}

module.exports = JwtAuthTokenManager;
