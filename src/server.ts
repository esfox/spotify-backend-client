import fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import { Encryption } from './encryption';
import { FetchTokenError, Spotify } from './spotify';
import { CallbackResponseBody, ObtainTokensCallback } from './types';

const currentDirectory = __filename.substring(0, __filename.lastIndexOf('/'));
const pages = {
  callback: fs.readFileSync(path.join(currentDirectory, 'callback.html'), 'utf-8'),
};

export class Server
{
  static onObtainTokens: ObtainTokensCallback;

  static async start()
  {
    const server = fastify({ logger: true });
    server.get<{ Querystring: CallbackResponseBody }>('/callback', async(request, reply) =>
    {
      const { code, state: identifier } = request.query;
      let tokens;
      try
      {
        tokens = await Spotify.requestAuthTokens(code);
      }
      catch (error)
      {
        if(error instanceof FetchTokenError)
        {
          const { response } = error;
          server.log.error(response);
          return reply.status(response.status).send(response);
        }

        server.log.error(error);
        return reply.status(500).send();
      }

      try
      {
        if(Server.onObtainTokens)
          Server.onObtainTokens(Encryption.encryptTokens({ identifier, ...tokens }));
      }
      catch (error)
      {
        server.log.error(error);
        return reply.status(500).send();
      }

      return reply.header('Content-Type', 'text/html').send(pages.callback);
    });

    try
    {
      await server.listen(process.env.PORT || 2422);
      console.log('Spotify Backend Client server started');
      console.log(server.server.address());
    }
    catch (error)
    {
      server.log.error(error);
      process.exit(1);
    }
  }
}
