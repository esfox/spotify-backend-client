var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
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
var import_encryption = require("./encryption");
var import_firestore = require("./firestore");
var import_spotify = require("./spotify");
class AuthTokens {
  static get(identifier) {
    return __async(this, null, function* () {
      const hashedIdentifier = import_encryption.Encryption.hash(identifier);
      const tokens = yield import_firestore.Firestore.getDocument(hashedIdentifier);
      if (!tokens)
        return;
      return {
        accessToken: import_encryption.Encryption.decrypt(tokens.accessToken),
        refreshToken: import_encryption.Encryption.decrypt(tokens.refreshToken)
      };
    });
  }
  static save(identifier, tokens) {
    return __async(this, null, function* () {
      const hashedIdentifier = import_encryption.Encryption.hash(identifier);
      const encryptedTokens = {
        accessToken: import_encryption.Encryption.encrypt(tokens.accessToken),
        refreshToken: import_encryption.Encryption.encrypt(tokens.refreshToken)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthTokens
});
