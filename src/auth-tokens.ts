import { Encryption } from './encryption';
import { Firestore } from './firestore';
import { Spotify } from './spotify';
import { AuthTokens as AuthTokensType } from './types';

export class AuthTokens
{
  static async get(identifier: string)
  {
    const hashedIdentifier = Encryption.hash(identifier);
    const tokens = await Firestore.getDocument<AuthTokensType>(hashedIdentifier);
    if(!tokens)
      return;

    return {
      accessToken: Encryption.decrypt(tokens.accessToken),
      refreshToken: Encryption.decrypt(tokens.refreshToken),
    };
  }

  static async save(identifier: string, tokens: AuthTokensType)
  {
    const hashedIdentifier = Encryption.hash(identifier);
    const encryptedTokens: AuthTokensType = {
      accessToken: Encryption.encrypt(tokens.accessToken),
      refreshToken: Encryption.encrypt(tokens.refreshToken),
    };

    return Firestore.setDocument(hashedIdentifier, encryptedTokens);
  }

  static async refresh(identifier: string)
  {
    const tokens = await AuthTokens.get(identifier);
    if(!tokens)
      return;

    const newTokens = await Spotify.requestAuthTokens(tokens.refreshToken);
    await this.save(identifier, newTokens);
    return newTokens;
  }
}
