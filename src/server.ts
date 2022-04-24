import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import { FetchTokenError, Spotify } from './spotify';
import { CallbackResponseBody } from './types';

const server = fastify({ logger: true });

server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

server.get<{ Querystring: CallbackResponseBody }>('/callback', async(request, reply) =>
{
  const { code, state: userId } = request.query;
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

    return reply.status(500).send();
  }

  try
  {
    await Spotify.saveAuthTokens(userId, tokens);
  }
  catch (error)
  {
    server.log.error(error);
    return reply.status(500).send();
  }

  return reply.sendFile('callback.html');
});

export const startServer = async () =>
{
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
};
