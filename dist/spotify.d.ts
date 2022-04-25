import SpotifyWebApi from 'spotify-web-api-node';
import { FetchTokenErrorResponse } from './types';
export declare class Spotify {
    static getOAuthUrl(userId: string): string;
    static requestAuthTokens(authorizationCode: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static createAuthenticatedApi(userId: string): Promise<SpotifyWebApi>;
}
export declare class FetchTokenError extends Error {
    response: FetchTokenErrorResponse;
    constructor(response: FetchTokenErrorResponse);
}
//# sourceMappingURL=spotify.d.ts.map