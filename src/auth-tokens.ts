import crypto from 'crypto';
import { Config } from './config';
import { Firestore } from './firestore';
import { Spotify } from './spotify';
import { AuthTokens as AuthTokensType } from './types';

export class AuthTokens
{
  static async get(identifier: string)
  {
    const hashedIdentifier = hash(identifier);
    const tokens = await Firestore.getDocument<AuthTokensType>(hashedIdentifier);
    if(!tokens)
      return;

    return {
      accessToken: decrypt(tokens.accessToken),
      refreshToken: decrypt(tokens.refreshToken),
    };
  }

  static async save(identifier: string, tokens: AuthTokensType)
  {
    const hashedIdentifier = hash(identifier);
    const encryptedTokens: AuthTokensType = {
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
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

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Encryption */

const algorithm = Config.ENCRYPTION_ALGORITHM as crypto.CipherGCMTypes;
const key = Config.ENCRYPTION_KEY as string;

function encrypt(string: string)
{
  const ivBuffer = Buffer.from(crypto.randomBytes(12));
  const cipher = crypto.createCipheriv(algorithm, key, ivBuffer);
  let encrypted = cipher.update(string, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  const iv = ivBuffer.toString('base64');
  const authTag = cipher.getAuthTag().toString('base64');
  let fullEncryptedString = `${iv}.${authTag}.${encrypted}`;
  fullEncryptedString = fullEncryptedString.split('').reverse().join('');
  fullEncryptedString = Buffer.from(fullEncryptedString).toString('base64');
  return fullEncryptedString;
}

function decrypt(encryptedString: string)
{
  let decodedEncryptedString = Buffer.from(encryptedString, 'base64').toString('utf-8');
  decodedEncryptedString = decodedEncryptedString.split('').reverse().join('');

  const [ iv, authTag, encrypted ] = decodedEncryptedString.split('.');
  const ivBuffer = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

function hash(string: string)
{
  const reversed = string.split('').reverse().join('');
  const base64Reversed = Buffer.from(reversed).toString('base64');
  return crypto.createHmac('sha256', key).update(base64Reversed).digest('hex');
}
