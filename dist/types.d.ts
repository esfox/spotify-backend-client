export declare type FetchTokenResponseBody = {
    access_token: string;
    refresh_token: string;
};
export declare type FetchTokenErrorResponse = {
    [key: string]: unknown;
    status: number;
};
export declare type CallbackResponseBody = {
    code: string;
    state: string;
};
export declare type AuthTokensType = {
    accessToken: string;
    refreshToken: string;
};
export declare type AuthTokensWithIdentifier = {
    identifier?: string;
    accessToken: string;
    refreshToken: string;
};
export declare type ObtainTokensCallback = (tokens: AuthTokensWithIdentifier) => void;
//# sourceMappingURL=types.d.ts.map