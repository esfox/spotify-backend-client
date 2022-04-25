var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var spotify_exports = {};
__export(spotify_exports, {
  FetchTokenError: () => FetchTokenError,
  Spotify: () => Spotify
});
module.exports = __toCommonJS(spotify_exports);
var import_phin = __toESM(require("phin"));
var import_spotify_web_api_node = __toESM(require("spotify-web-api-node"));
var import_auth_tokens = require("./auth-tokens");
var import_config = require("./config");
var _a;
const callbackUrl = new URL("/callback", import_config.Config.SPOTIFY_CALLBACK_BASE_URL).href;
const spotify = {
  urls: {
    accounts: "https://accounts.spotify.com/",
    api: "https://api.spotify.com/v1"
  },
  clientId: import_config.Config.SPOTIFY_CLIENT_ID,
  clientSecret: import_config.Config.SPOTIFY_CLIENT_SECRET,
  scopes: (_a = import_config.Config.SPOTIFY_SCOPES) == null ? void 0 : _a.replace(/,/g, "+")
};
class Spotify {
  static getOAuthUrl(userId) {
    if (!spotify.clientId || !spotify.scopes)
      throw new Error("No Spotify Client ID provided");
    const oauthUrl = new URL("/authorize", spotify.urls.accounts);
    oauthUrl.searchParams.set("response_type", "code");
    oauthUrl.searchParams.set("redirect_uri", callbackUrl);
    oauthUrl.searchParams.set("state", userId);
    oauthUrl.searchParams.set("client_id", spotify.clientId);
    oauthUrl.searchParams.set("scope", spotify.scopes);
    return oauthUrl.href.replace(/%2B/g, "+");
  }
  static requestAuthTokens(authorizationCode) {
    return __async(this, null, function* () {
      const encodedCredentials = Buffer.from(`${spotify.clientId}:${spotify.clientSecret}`).toString("base64");
      const response = yield (0, import_phin.default)({
        url: new URL("/api/token", spotify.urls.accounts).href,
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedCredentials}`
        },
        form: {
          code: authorizationCode,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code"
        },
        parse: "json"
      });
      const { body, statusCode } = response;
      if (response.statusCode !== 200)
        throw new FetchTokenError(__spreadProps(__spreadValues({}, body), { status: statusCode || 500 }));
      return {
        accessToken: body.access_token,
        refreshToken: body.refresh_token
      };
    });
  }
  static createAuthenticatedApi(userId) {
    return __async(this, null, function* () {
      const tokens = yield import_auth_tokens.AuthTokens.get(userId);
      if (!tokens)
        throw new Error("Cannot get auth tokens");
      const { accessToken } = tokens;
      const spotifyWebApi = new import_spotify_web_api_node.default();
      spotifyWebApi.setAccessToken(accessToken);
      return spotifyWebApi;
    });
  }
}
class FetchTokenError extends Error {
  constructor(response) {
    super();
    this.response = response;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchTokenError,
  Spotify
});
