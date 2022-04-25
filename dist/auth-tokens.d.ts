import { AuthTokens as AuthTokensType } from './types';
export declare class AuthTokens {
    static get(identifier: string): Promise<{
        accessToken: string;
        refreshToken: string;
    } | undefined>;
    static save(identifier: string, tokens: AuthTokensType): Promise<unknown>;
    static refresh(identifier: string): Promise<{
        accessToken: string;
        refreshToken: string;
    } | undefined>;
}
//# sourceMappingURL=auth-tokens.d.ts.map