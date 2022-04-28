import p from 'phin';
import { Config } from './config';
import { FetchTokenErrorResponse, FetchTokenResponseBody } from './types';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_SCOPES,
  SPOTIFY_CALLBACK_BASE_URL,
} = Config;

if(!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_SCOPES)
  throw new Error('Invalid Spotify credentials');

const callbackUrl = new URL('/callback', SPOTIFY_CALLBACK_BASE_URL).href;
const spotifyAccountsUrl = 'https://accounts.spotify.com/';
const spotify =
{
  urls:
  {
    token: new URL('/api/token', spotifyAccountsUrl),
    authorize: new URL('/authorize', spotifyAccountsUrl),
  },
  scopes: Config.SPOTIFY_SCOPES?.replace(/,/g, '+') as string
};

const getAuthorizationHeader = () =>
{
  const encodedCredentials = Buffer
    .from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
    .toString('base64');
  return `Basic ${encodedCredentials}`;
};

export class Spotify
{
  static getOAuthUrl(identifier: string)
  {
    if(!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_SCOPES)
      throw new Error('Invalid Spotify credentials');

    const oauthUrl = spotify.urls.authorize;
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('redirect_uri', callbackUrl);
    oauthUrl.searchParams.set('state', identifier);
    oauthUrl.searchParams.set('client_id', SPOTIFY_CLIENT_ID);
    oauthUrl.searchParams.set('scope', spotify.scopes);
    return oauthUrl.href.replace(/%2B/g, '+');
  }

  static async requestAuthTokens(authorizationCode: string, isRefresh?: boolean)
  {
    const form: { [index: string]: string } = (
      isRefresh ? {
        grant_type: 'refresh_token',
        refresh_token: authorizationCode,
      } : {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: callbackUrl,
      }
    );

    const response = await p<FetchTokenResponseBody>({
      url: spotify.urls.token.href,
      method: 'POST',
      headers: {
        Authorization: getAuthorizationHeader(),
      },
      form,
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
