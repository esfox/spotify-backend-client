import p from 'phin';
import SpotifyWebApi from 'spotify-web-api-node';
import { Config } from './config';
import { Firestore } from './firestore';
import { AuthTokens, FetchTokenErrorResponse, FetchTokenResponseBody } from './types';

const callbackUrl = new URL('/callback', Config.BASE_URL).href;
const spotify =
{
  urls:
  {
    accounts: 'https://accounts.spotify.com/',
    api: 'https://api.spotify.com/v1',
  },
  clientId: Config.SPOTIFY_CLIENT_ID,
  clientSecret: Config.SPOTIFY_CLIENT_SECRET,
  scopes: Config.SPOTIFY_SCOPES?.replace(/,/g, '+')
};

export class Spotify
{
  static getOAuthUrl(userId: string)
  {
    if(!spotify.clientId || !spotify.scopes)
      throw new Error('No Spotify Client ID provided');

    const oauthUrl = new URL('/authorize', spotify.urls.accounts);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('redirect_uri', callbackUrl);
    oauthUrl.searchParams.set('state', userId);
    oauthUrl.searchParams.set('client_id', spotify.clientId);
    oauthUrl.searchParams.set('scope', spotify.scopes);
    return oauthUrl.href.replace(/%2B/g, '+');
  }

  static async requestAuthTokens(authorizationCode: string)
  {
    const encodedCredentials = Buffer
      .from(`${spotify.clientId}:${spotify.clientSecret}`)
      .toString('base64');

    const response = await p<FetchTokenResponseBody>({
      url: new URL('/api/token', spotify.urls.accounts).href,
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
      form: {
        code: authorizationCode,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      },
      parse: 'json',
    });

    const { body, statusCode } = response;
    if(response.statusCode !== 200)
      throw new FetchTokenError({ ...body, status: statusCode || 500 });

    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
    };
  }

  static async refreshAuthTokens(userId: string)
  {
    const { refreshToken } = await this.getAuthTokens(userId);
    const newTokens = await this.requestAuthTokens(refreshToken);
    await this.saveAuthTokens(userId, newTokens);
    return newTokens;
  }

  static async getAuthTokens(userId: string)
  {
    return Firestore.getDocument<AuthTokens>(userId);
  }

  static async saveAuthTokens(userId: string, tokens: AuthTokens)
  {
    await Firestore.setDocument(userId, tokens);
  }

  static async createAuthenticatedApi(userId: string)
  {
    const { accessToken } = await Spotify.getAuthTokens(userId);
    const spotifyWebApi = new SpotifyWebApi();
    spotifyWebApi.setAccessToken(accessToken);
    return spotifyWebApi;
  }
}

export class FetchTokenError extends Error
{
  public response: FetchTokenErrorResponse;

  constructor(response: FetchTokenErrorResponse)
  {
    super();
    this.response = response;
  }
}
