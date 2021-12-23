const AddAuthentication = require('../AddAuthentication');

describe('an AddAuthentication entities', () => {
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
			expect(() => new AddAuthentication(payload)).toThrowError('ADD_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
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
			expect(() => new AddAuthentication(payload)).toThrowError('ADD_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
		});
	});

	it('should create AddAuthentication object correctly', () => {
		// Arrange
		const payload = {
			username: 'ryumada',
			password: 'super-secret-please',
		};

		// Action
		const addAuthentication = new AddAuthentication(payload);

		// Assert
		expect(addAuthentication.username).toEqual(payload.username);
		expect(addAuthentication.password).toEqual(payload.password);
	});
});
