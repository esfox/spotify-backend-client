import Crypto from 'crypto';
import { Config } from './config';

const algorithm = Config.ENCRYPTION_ALGORITHM as Crypto.CipherGCMTypes;
const key = Config.ENCRYPTION_KEY as string;

export class Encryption
{
  static encrypt(string: string)
  {
    const ivBuffer = Buffer.from(Crypto.randomBytes(12));
    const cipher = Crypto.createCipheriv(algorithm, key, ivBuffer);
    let encrypted = cipher.update(string, 'utf-8', 'base64');
    encrypted += cipher.final('base64');

    const iv = ivBuffer.toString('base64');
    const authTag = cipher.getAuthTag().toString('base64');
    let fullEncryptedString = `${iv}.${authTag}.${encrypted}`;
    fullEncryptedString = [...fullEncryptedString].reverse().join('');
    fullEncryptedString = Buffer.from(fullEncryptedString).toString('base64');
    return fullEncryptedString;
  }

  static decrypt(encryptedString: string)
  {
    let decodedEncryptedString = Buffer.from(encryptedString, 'base64').toString('utf-8');
    decodedEncryptedString = [...decodedEncryptedString].reverse().join('');

    const [ iv, authTag, encrypted ] = decodedEncryptedString.split('.');
    const ivBuffer = Buffer.from(iv, 'base64');
    const decipher = Crypto.createDecipheriv(algorithm, key, ivBuffer);
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }

  static hash(string: string)
  {
    const reversed = [...string].reverse().join('');
    const base64Reversed = Buffer.from(reversed).toString('base64');
    return Crypto.createHmac('sha256', key).update(base64Reversed).digest('hex');
  }
}

