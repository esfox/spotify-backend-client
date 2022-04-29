import { AuthTokensType, AuthTokensWithIdentifier } from './types';
export declare class Encryption {
    static encryptTokens({ accessToken, refreshToken, identifier, }: AuthTokensWithIdentifier): AuthTokensWithIdentifier;
    static decryptTokens({ accessToken, refreshToken }: Partial<AuthTokensType>): Partial<AuthTokensType>;
    static encrypt(string: string): string;
    static decrypt(encryptedString: string): string;
    static hash(string: string): string;
}
//# sourceMappingURL=encryption.d.ts.map