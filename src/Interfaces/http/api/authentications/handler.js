const AuthenticationUseCase = require('../../../../Applications/use_case/AuthenticationUseCase');

class AuthenticationsHandler {
	constructor(container) {
		this._container = container;

		this.postAuthentication = this.postAuthentication.bind(this);
		this.putAuthentication = this.putAuthentication.bind(this);
		this.deleteAuthentication = this.deleteAuthentication.bind(this);
	}

	async postAuthentication({payload}, h) {
		const authenticationsUseCase = this._container.getInstance(AuthenticationUseCase.name);
		const {accessToken, refreshToken} = await authenticationsUseCase.addNewAuthentication(payload);

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
		const authenticationsUseCase = this._container.getInstance(AuthenticationUseCase.name);
		const accessToken = await authenticationsUseCase.refreshAuthentication(payload);

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
		const authenticationsUseCase = this._container.getInstance(AuthenticationUseCase.name);
		await authenticationsUseCase.deleteAuthentication(payload);

		const response = h.response({
			status: 'success',
			message: 'Anda berhasil logout',
		});
		response.code(200);
		return response;
	}
}

module.exports = AuthenticationsHandler;
