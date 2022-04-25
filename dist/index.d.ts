import { AuthTokens } from './auth-tokens';
import { Spotify } from './spotify';
export declare class SpotifyBackendClient {
    static startServer: () => Promise<void>;
    static createAuthenticatedApi: typeof Spotify.createAuthenticatedApi;
    static getLoginUrl: typeof Spotify.getOAuthUrl;
    static getAuthTokens: typeof AuthTokens.get;
    static refreshAuthTokens: typeof AuthTokens.refresh;
}
//# sourceMappingURL=index.d.ts.map