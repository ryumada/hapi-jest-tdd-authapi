const NewAuth = require('../NewAuth');

describe('an NewAuth entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payloads = [
			{
				username: 'ryumada',
			},
			{
				password: 'super-secret-please',
			},
		];

		// Action and Assert
		payloads.forEach(payload => {
			expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
		});
	});

	it('should throw error when payload did not meet data type specification', () => {
		// Arrange
		const payloads = [
			{
				username: 123,
				password: 'super-secret-please',
			},
			{
				username: 'ryumada',
				password: 32143654235,
			},
		];

		// Action and Assert
		payloads.forEach(payload => {
			expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
		});
	});

	it('should create NewAuth object correctly', () => {
		// Arrange
		const payload = {
			username: 'ryumada',
			password: 'super-secret-please',
		};

		// Action
		const newAuth = new NewAuth(payload);

		// Assert
		expect(newAuth.username).toEqual(payload.username);
		expect(newAuth.password).toEqual(payload.password);
	});
});
