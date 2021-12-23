class AddAuthentication {
	constructor(payload) {
		this._verifyPayload(payload);

		const {username, password} = payload;

		this.username = username;
		this.password = password;
	}

	_verifyPayload({username, password}) {
		if (!username || !password) {
			throw new Error('ADD_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof username !== 'string' || typeof password !== 'string') {
			throw new Error('ADD_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}
	}
}

module.exports = AddAuthentication;
