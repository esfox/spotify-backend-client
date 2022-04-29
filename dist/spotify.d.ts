import { FetchTokenErrorResponse } from './types';
export declare class Spotify {
    static getOAuthUrl(identifier: string): string;
    static requestAuthTokens(authorizationCode: string, isRefresh?: boolean): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare class FetchTokenError extends Error {
    response: FetchTokenErrorResponse;
    constructor(response: FetchTokenErrorResponse);
}
//# sourceMappingURL=spotify.d.ts.map