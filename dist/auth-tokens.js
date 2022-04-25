var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var auth_tokens_exports = {};
__export(auth_tokens_exports, {
  AuthTokens: () => AuthTokens
});
module.exports = __toCommonJS(auth_tokens_exports);
var import_crypto = __toESM(require("crypto"));
var import_config = require("./config");
var import_firestore = require("./firestore");
var import_spotify = require("./spotify");
class AuthTokens {
  static get(identifier) {
    return __async(this, null, function* () {
      const hashedIdentifier = hash(identifier);
      const tokens = yield import_firestore.Firestore.getDocument(hashedIdentifier);
      if (!tokens)
        return;
      return {
        accessToken: decrypt(tokens.accessToken),
        refreshToken: decrypt(tokens.refreshToken)
      };
    });
  }
  static save(identifier, tokens) {
    return __async(this, null, function* () {
      const hashedIdentifier = hash(identifier);
      const encryptedTokens = {
        accessToken: encrypt(tokens.accessToken),
        refreshToken: encrypt(tokens.refreshToken)
      };
      return import_firestore.Firestore.setDocument(hashedIdentifier, encryptedTokens);
    });
  }
  static refresh(identifier) {
    return __async(this, null, function* () {
      const tokens = yield AuthTokens.get(identifier);
      if (!tokens)
        return;
      const newTokens = yield import_spotify.Spotify.requestAuthTokens(tokens.refreshToken);
      yield this.save(identifier, newTokens);
      return newTokens;
    });
  }
}
const algorithm = import_config.Config.ENCRYPTION_ALGORITHM;
const key = import_config.Config.ENCRYPTION_KEY;
function encrypt(string) {
  const ivBuffer = Buffer.from(import_crypto.default.randomBytes(12));
  const cipher = import_crypto.default.createCipheriv(algorithm, key, ivBuffer);
  let encrypted = cipher.update(string, "utf-8", "base64");
  encrypted += cipher.final("base64");
  const iv = ivBuffer.toString("base64");
  const authTag = cipher.getAuthTag().toString("base64");
  let fullEncryptedString = `${iv}.${authTag}.${encrypted}`;
  fullEncryptedString = fullEncryptedString.split("").reverse().join("");
  fullEncryptedString = Buffer.from(fullEncryptedString).toString("base64");
  return fullEncryptedString;
}
function decrypt(encryptedString) {
  let decodedEncryptedString = Buffer.from(encryptedString, "base64").toString("utf-8");
  decodedEncryptedString = decodedEncryptedString.split("").reverse().join("");
  const [iv, authTag, encrypted] = decodedEncryptedString.split(".");
  const ivBuffer = Buffer.from(iv, "base64");
  const decipher = import_crypto.default.createDecipheriv(algorithm, key, ivBuffer);
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  let decrypted = decipher.update(encrypted, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
function hash(string) {
  const reversed = string.split("").reverse().join("");
  const base64Reversed = Buffer.from(reversed).toString("base64");
  return import_crypto.default.createHmac("sha256", key).update(base64Reversed).digest("hex");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthTokens
});
