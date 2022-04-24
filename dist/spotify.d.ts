import SpotifyWebApi from 'spotify-web-api-node';
import { AuthTokens, FetchTokenErrorResponse } from './types';
export declare class Spotify {
    static getOAuthUrl(userId: string): string;
    static requestAuthTokens(authorizationCode: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static refreshAuthTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static getAuthTokens(userId: string): Promise<AuthTokens>;
    static saveAuthTokens(userId: string, tokens: AuthTokens): Promise<void>;
    static createAuthenticatedApi(userId: string): Promise<SpotifyWebApi>;
}
export declare class FetchTokenError extends Error {
    response: FetchTokenErrorResponse;
    constructor(response: FetchTokenErrorResponse);
}
//# sourceMappingURL=spotify.d.ts.map