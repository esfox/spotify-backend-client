import { Spotify } from './spotify';
export declare class SpotifyBackendClient {
    static startServer: () => Promise<void>;
    static createAuthenticatedApi: typeof Spotify.createAuthenticatedApi;
    static getLoginUrl: typeof Spotify.getOAuthUrl;
    static getAuthTokens: typeof Spotify.getAuthTokens;
    static refreshAuthTokens: typeof Spotify.refreshAuthTokens;
}
//# sourceMappingURL=index.d.ts.map