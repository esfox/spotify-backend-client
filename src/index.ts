import { Encryption } from './encryption';
import { Server } from './server';
import { Spotify } from './spotify';
import { ObtainTokensCallback } from './types';

export class SpotifyTokensHandler
{
  static startServer = Server.start;
  static getAuthorizeUrl = Spotify.getOAuthUrl;
  static onObtainTokens = (callback: ObtainTokensCallback) => Server.onObtainTokens = callback;
  static encodeIdentifier = Encryption.hash;
  static decodeTokens = Encryption.decryptTokens;
  static refreshAuthTokens = async (refreshToken: string) =>
  {
    const tokens = await Spotify.requestAuthTokens(refreshToken, true);
    const { accessToken, refreshToken: newRefreshToken } = tokens;
    return Encryption.encryptTokens({
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });
  };
}
