const AuthenticationUseCase = require('../../../../Applications/use_case/AuthenticationUseCase');

class AuthenticationsHandler {
	constructor(container) {
		this._authenticationUseCase = container.getInstance(AuthenticationUseCase.name);

		this.postAuthentication = this.postAuthentication.bind(this);
		this.putAuthentication = this.putAuthentication.bind(this);
		this.deleteAuthentication = this.deleteAuthentication.bind(this);
	}

	async postAuthentication({payload}, h) {
		const {accessToken, refreshToken} = await this._authenticationUseCase.addNewAuthentication(payload);

		const response = h.response({
			status: 'success',
			data: {
				accessToken,
				refreshToken,
			},
		});
		response.code(201);
		return response;
	}

	async putAuthentication({payload}, h) {
		const accessToken = await this._authenticationUseCase.refreshAuthentication(payload);

		const response = h.response({
			status: 'success',
			data: {
				accessToken,
			},
		});
		response.code(200);
		return response;
	}

	async deleteAuthentication({payload}, h) {
		await this._authenticationUseCase.deleteAuthentication(payload);

		const response = h.response({
			status: 'success',
			message: 'Anda berhasil logout',
		});
		response.code(200);
		return response;
	}
}

module.exports = AuthenticationsHandler;
