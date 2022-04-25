import { AuthTokens } from './auth-tokens';
import { startServer } from './server';
import { Spotify } from './spotify';

export class SpotifyBackendClient
{
  static startServer = startServer;
  static createAuthenticatedApi = Spotify.createAuthenticatedApi;
  static getLoginUrl = Spotify.getOAuthUrl;
  static getAuthTokens = AuthTokens.get;
  static refreshAuthTokens = AuthTokens.refresh;
}
