import { Encryption } from './encryption';
import { Server } from './server';
import { Spotify } from './spotify';
import { ObtainTokensCallback } from './types';
export declare class SpotifyTokensHandler {
    static startServer: typeof Server.start;
    static getAuthorizeUrl: typeof Spotify.getOAuthUrl;
    static onObtainTokens: (callback: ObtainTokensCallback) => ObtainTokensCallback;
    static encodeIdentifier: typeof Encryption.hash;
    static decodeTokens: typeof Encryption.decryptTokens;
    static refreshAuthTokens: (refreshToken: string) => Promise<import("./types").AuthTokensWithIdentifier>;
}
//# sourceMappingURL=index.d.ts.map