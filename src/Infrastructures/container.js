/* istanbul ignore file */

const {createContainer} = require('instances-container');

// External agency
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');
const Jwt = require('@hapi/jwt');

// Service (repository, helper, manager, etc)
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordCompare = require('./security/BcryptPasswordCompare');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtAuthTokenManager = require('./security/JwtAuthTokenManager');

// Applications/use_case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationUseCase = require('../Applications/use_case/AuthenticationUseCase');

// Applications/security
const AuthTokenManager = require('../Applications/security/AuthTokenManager');
const PasswordCompare = require('../Applications/security/PasswordCompare');
const PasswordHash = require('../Applications/security/PasswordHash');

// Domains/repository
const UserRepository = require('../Domains/users/UserRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');

// Creating Container
const container = createContainer();

// Registering services and repository
container.register([
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
	{
		key: AuthTokenManager.name,
		Class: JwtAuthTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt,
				},
			],
		},
	},
	{
		key: PasswordCompare.name,
		Class: BcryptPasswordCompare,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
]);

// Registering use case
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: AuthenticationUseCase.name,
		Class: AuthenticationUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'passwordCompare',
					internal: PasswordCompare.name,
				},
				{
					name: 'authTokenManager',
					internal: AuthTokenManager.name,
				},
			],
		},
	},
]);

module.exports = container;
