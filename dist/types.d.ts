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
export declare type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=types.d.ts.map