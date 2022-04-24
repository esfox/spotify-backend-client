import { startServer } from './server';
import { Spotify } from './spotify';

export class SpotifyBackendClient
{
  static startServer = startServer;
  static createAuthenticatedApi = Spotify.createAuthenticatedApi;
  static getLoginUrl = Spotify.getOAuthUrl;
  static getAuthTokens = Spotify.getAuthTokens;
  static refreshAuthTokens = Spotify.refreshAuthTokens;
}
