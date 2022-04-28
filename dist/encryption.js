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
var encryption_exports = {};
__export(encryption_exports, {
  Encryption: () => Encryption
});
module.exports = __toCommonJS(encryption_exports);
var import_crypto = __toESM(require("crypto"));
var import_config = require("./config");
const algorithm = import_config.Config.ENCRYPTION_ALGORITHM;
const key = import_config.Config.ENCRYPTION_KEY;
class Encryption {
  static encrypt(string) {
    const ivBuffer = Buffer.from(import_crypto.default.randomBytes(12));
    const cipher = import_crypto.default.createCipheriv(algorithm, key, ivBuffer);
    let encrypted = cipher.update(string, "utf-8", "base64");
    encrypted += cipher.final("base64");
    const iv = ivBuffer.toString("base64");
    const authTag = cipher.getAuthTag().toString("base64");
    let fullEncryptedString = `${iv}.${authTag}.${encrypted}`;
    fullEncryptedString = [...fullEncryptedString].reverse().join("");
    fullEncryptedString = Buffer.from(fullEncryptedString).toString("base64");
    return fullEncryptedString;
  }
  static decrypt(encryptedString) {
    let decodedEncryptedString = Buffer.from(encryptedString, "base64").toString("utf-8");
    decodedEncryptedString = [...decodedEncryptedString].reverse().join("");
    const [iv, authTag, encrypted] = decodedEncryptedString.split(".");
    const ivBuffer = Buffer.from(iv, "base64");
    const decipher = import_crypto.default.createDecipheriv(algorithm, key, ivBuffer);
    decipher.setAuthTag(Buffer.from(authTag, "base64"));
    let decrypted = decipher.update(encrypted, "base64", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  }
  static hash(string) {
    const reversed = [...string].reverse().join("");
    const base64Reversed = Buffer.from(reversed).toString("base64");
    return import_crypto.default.createHmac("sha256", key).update(base64Reversed).digest("hex");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Encryption
});
