export type FetchTokenResponseBody = { access_token: string, refresh_token: string };
export type FetchTokenErrorResponse = { [key: string]: unknown, status: number };
export type CallbackResponseBody = { code: string, state: string };
export type AuthTokensType = { accessToken: string, refreshToken: string };
export type AuthTokensWithIdentifier = { identifier?: string, accessToken: string, refreshToken: string };
export type ObtainTokensCallback = (tokens: AuthTokensWithIdentifier) => void;