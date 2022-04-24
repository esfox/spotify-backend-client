export type FetchTokenResponseBody = { access_token: string, refresh_token: string };
export type FetchTokenErrorResponse = { [key: string]: unknown, status: number };
export type CallbackResponseBody = { code: string, state: string };
export type AuthTokens = { accessToken: string, refreshToken: string };