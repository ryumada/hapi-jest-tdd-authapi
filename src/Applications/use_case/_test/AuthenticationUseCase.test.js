// Domains
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
// Repositories
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
// Applications
const PasswordHash = require('../../security/PasswordHash');
const AuthTokenManager = require('../../security/AuthTokenManager');
// Applications/use_case
const AuthenticationUseCase = require('../AuthenticationUseCase');

describe('AuthenticationUseCase', () => {
	describe('An addNewAuthentication function', () => {
		it('should be orchestrating the authentication adding action correctly', async () => {
			// Arrange
			const useCasePayload = {
				username: 'ryumada',
				password: 'super-secret-please',
			};
			const newAuth = new NewAuth(useCasePayload);
			const resultUser = {
				id: 'user-1234567890123456',
				password: 'some-hashed-password',
			};

			/** Creating dependency of use case */
			const mockAuthenticationRepository = new AuthenticationRepository();
			const mockUserRepository = new UserRepository();
			const mockPasswordHash = new PasswordHash();
			const mockAuthTokenManager = new AuthTokenManager();

			/** Mocking needed function */
			mockUserRepository.getUser = jest.fn()
				.mockImplementation(() => Promise.resolve(resultUser));
			mockPasswordHash.compare = jest.fn()
				.mockImplementation(() => Promise.resolve(true));
			mockAuthTokenManager.generateAccessToken = jest.fn()
				.mockImplementation(() => 'dummy_accessToken');
			mockAuthTokenManager.generateRefreshToken = jest.fn()
				.mockImplementation(() => 'dummy_refreshToken');
			mockAuthenticationRepository.addRefreshToken = jest.fn()
				.mockImplementation(() => Promise.resolve());

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({
				authenticationRepository: mockAuthenticationRepository,
				userRepository: mockUserRepository,
				passwordHash: mockPasswordHash,
				authTokenManager: mockAuthTokenManager,
			});

			// Action
			const tokens = await getAuthenticationUseCase.addNewAuthentication(useCasePayload);

			// Assert
			expect(tokens).toHaveProperty('accessToken');
			expect(typeof tokens.accessToken).toEqual('string');
			expect(tokens).toHaveProperty('refreshToken');
			expect(typeof tokens.refreshToken).toEqual('string');
			expect(mockUserRepository.getUser).toBeCalledWith(newAuth.username);
			expect(mockPasswordHash.compare).toBeCalledWith(newAuth.password, resultUser.password);
			expect(mockAuthTokenManager.generateAccessToken).toBeCalledWith({id: resultUser.id});
			expect(mockAuthTokenManager.generateRefreshToken).toBeCalledWith({id: resultUser.id});
			expect(mockAuthenticationRepository.addRefreshToken).toBeCalledWith('dummy_refreshToken');
		});

		it('should throw error when the password mismatch', () => {
			// Arrange
			const useCasePayload = {
				username: 'ryumada',
				password: 'super-secret-please',
			};
			const resultUser = {
				id: 'user-1234567890123456',
				password: 'some-hashed-password',
			};

			/** Creating dependency of use case */
			const mockUserRepository = new UserRepository();
			const mockPasswordHash = new PasswordHash();

			/** Mocking needed function */
			mockUserRepository.getUser = jest.fn()
				.mockImplementation(() => Promise.resolve(resultUser));
			mockPasswordHash.compare = jest.fn()
				.mockImplementation(() => Promise.resolve(false));

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({
				userRepository: mockUserRepository,
				passwordHash: mockPasswordHash,
			});

			// Action & Assert
			expect(getAuthenticationUseCase.addNewAuthentication(useCasePayload)).rejects.toThrowError('AUTHENTICATION_USE_CASE.PASSWORD_MISMATCH');
		});
	});

	describe('A refreshAuthentication function', () => {
		it('should be orchestrating the authentication refresh action correctly', async () => {
			// Arrange
			const useCasePayload = {
				refreshToken: 'dummy_refreshToken',
			};

			/** Creating dependency of use case */
			const mockAuthenticationRepository = new AuthenticationRepository();
			const mockAuthTokenManager = new AuthTokenManager();

			/** Mocking needed function */
			mockAuthenticationRepository.verifyRefreshToken = jest.fn()
				.mockImplementation(() => Promise.resolve());
			mockAuthTokenManager.verifyRefreshToken = jest.fn()
				.mockImplementation(() => 'id_user');
			mockAuthTokenManager.generateAccessToken = jest.fn()
				.mockImplementation(() => 'dummy_newAccessToken');

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({
				authenticationRepository: mockAuthenticationRepository,
				authTokenManager: mockAuthTokenManager,
			});

			// Action
			const newAccessToken = await getAuthenticationUseCase.refreshAuthentication(useCasePayload);

			// Assert
			expect(mockAuthenticationRepository.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
			expect(mockAuthTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
			expect(mockAuthTokenManager.generateAccessToken).toBeCalledWith(useCasePayload.refreshToken);
			expect(newAccessToken).toEqual('dummy_newAccessToken');
		});

		it('should receive string refreshToken', async () => {
			// Arrange
			const useCasePayload = {
				refreshToken: 1234567890, // Bad refreshToken
			};

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({});

			// Action & Assert
			expect(getAuthenticationUseCase.refreshAuthentication(useCasePayload)).rejects.toThrowError('AUTHENTICATION_USE_CASE.REFRESH_TOKEN_MUST_BE_A_STRING');
		});

		it('should throw error when refreshToken not found', () => {
			// Arrange
			const useCasePayload = {
				refreshToken: '', // Bad refreshToken
			};

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({});

			// Action & Assert
			expect(getAuthenticationUseCase.refreshAuthentication(useCasePayload)).rejects.toThrowError('AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
		});
	});

	describe('A deleteAuthentication function', () => {
		it('should be orchestrating the authentication delete correctly', async () => {
			// Arrange
			const useCasePayload = {
				refreshToken: 'dummy_refreshToken',
			};

			/** Creating dependency of use case */
			const mockAuthenticationRepository = new AuthenticationRepository();
			const mockAuthTokenManager = new AuthTokenManager();

			/** Mocking needed function */
			mockAuthenticationRepository.verifyRefreshToken = jest.fn()
				.mockImplementation(() => Promise.resolve());
			mockAuthTokenManager.verifyRefreshToken = jest.fn()
				.mockImplementation(() => 'id_user');
			mockAuthenticationRepository.deleteRefreshToken = jest.fn()
				.mockImplementation(() => Promise.resolve());

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({
				authenticationRepository: mockAuthenticationRepository,
				authTokenManager: mockAuthTokenManager,
			});

			// Action
			await getAuthenticationUseCase.deleteAuthentication(useCasePayload);

			// Assert
			expect(mockAuthenticationRepository.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
			expect(mockAuthTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
			expect(mockAuthenticationRepository.deleteRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
		});

		it('should receive string refreshToken', async () => {
			// Arrange
			const useCasePayload = {
				refreshToken: 1234567890, // Bad refreshToken
			};

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({});

			// Action & Assert
			expect(getAuthenticationUseCase.deleteAuthentication(useCasePayload)).rejects.toThrowError('AUTHENTICATION_USE_CASE.REFRESH_TOKEN_MUST_BE_A_STRING');
		});

		it('should throw error when refreshToken not found', () => {
			// Arrange
			const useCasePayload = {
				refreshToken: '', // Bad refreshToken
			};

			/** Creating use case instance */
			const getAuthenticationUseCase = new AuthenticationUseCase({});

			// Action & Assert
			expect(getAuthenticationUseCase.deleteAuthentication(useCasePayload)).rejects.toThrowError('AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
		});
	});
});
