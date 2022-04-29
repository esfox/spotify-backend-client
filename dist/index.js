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
var src_exports = {};
__export(src_exports, {
  SpotifyTokensHandler: () => SpotifyTokensHandler
});
module.exports = __toCommonJS(src_exports);
var import_encryption = require("./encryption");
var import_server = require("./server");
var import_spotify = require("./spotify");
const _SpotifyTokensHandler = class {
};
let SpotifyTokensHandler = _SpotifyTokensHandler;
SpotifyTokensHandler.startServer = import_server.Server.start;
SpotifyTokensHandler.getAuthorizeUrl = import_spotify.Spotify.getOAuthUrl;
SpotifyTokensHandler.onObtainTokens = (callback) => import_server.Server.onObtainTokens = callback;
SpotifyTokensHandler.encodeIdentifier = import_encryption.Encryption.hash;
SpotifyTokensHandler.decodeTokens = import_encryption.Encryption.decryptTokens;
SpotifyTokensHandler.refreshAuthTokens = (refreshToken) => __async(_SpotifyTokensHandler, null, function* () {
  const tokens = yield import_spotify.Spotify.requestAuthTokens(refreshToken, true);
  const { accessToken, refreshToken: newRefreshToken } = tokens;
  return import_encryption.Encryption.encryptTokens({
    accessToken,
    refreshToken: newRefreshToken || refreshToken
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpotifyTokensHandler
});
