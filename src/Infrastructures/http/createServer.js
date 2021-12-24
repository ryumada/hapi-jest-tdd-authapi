const Hapi = require('@hapi/hapi');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');

const createServer = async container => {
	const server = Hapi.server({
		host: process.env.HOST,
		port: process.env.PORT,
	});

	await server.register([
		{
			plugin: users,
			options: {container},
		},
		{
			plugin: authentications,
			options: {container},
		},
	]);

	server.ext('onPreResponse', (request, h) => {
		// Mendapatkan konteks response dari request
		const {response} = request;

		if (response instanceof Error) {
			// Bila response tersebut error, tangani sesuai kebutuhan
			const translatedError = DomainErrorTranslator.translate(response);

			// Penanganan client error secara internal
			if (translatedError instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: translatedError.message,
				});
				newResponse.code(translatedError.statusCode);
				return newResponse;
			}

			if (!translatedError.isServer) {
				return h.continue;
			}

			// Penanganan server error sesuai kebutuhan
			const newResponse = h.response({
				status: 'error',
				message: 'terjadi kegagalan pada server kami',
			});
			newResponse.code(500);
			return newResponse;
		}

		// Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
		return h.continue;
	});

	return server;
};

module.exports = createServer;
