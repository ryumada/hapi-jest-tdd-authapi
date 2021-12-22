/* eslint-disable no-unused-vars */
// Sifatnya abstrak, jadi cukup definisikan fungsi-fungsinya saja
class UserRepository {
	async addUser(registerUser) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyAvailableUsername(username) {
		throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = UserRepository;
