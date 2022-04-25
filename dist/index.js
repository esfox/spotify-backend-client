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
var src_exports = {};
__export(src_exports, {
  SpotifyBackendClient: () => SpotifyBackendClient
});
module.exports = __toCommonJS(src_exports);
var import_auth_tokens = require("./auth-tokens");
var import_server = require("./server");
var import_spotify = require("./spotify");
class SpotifyBackendClient {
}
SpotifyBackendClient.startServer = import_server.startServer;
SpotifyBackendClient.createAuthenticatedApi = import_spotify.Spotify.createAuthenticatedApi;
SpotifyBackendClient.getLoginUrl = import_spotify.Spotify.getOAuthUrl;
SpotifyBackendClient.getAuthTokens = import_auth_tokens.AuthTokens.get;
SpotifyBackendClient.refreshAuthTokens = import_auth_tokens.AuthTokens.refresh;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpotifyBackendClient
});
