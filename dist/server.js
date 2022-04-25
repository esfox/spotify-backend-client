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
var server_exports = {};
__export(server_exports, {
  startServer: () => startServer
});
module.exports = __toCommonJS(server_exports);
var import_fastify = __toESM(require("fastify"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_spotify = require("./spotify");
const server = (0, import_fastify.default)({ logger: true });
const currentDirectory = __filename.substring(0, __filename.lastIndexOf("/"));
const pages = {
  callback: import_fs.default.readFileSync(import_path.default.join(currentDirectory, "callback.html"), "utf-8")
};
server.get("/callback", (request, reply) => __async(void 0, null, function* () {
  const { code, state: userId } = request.query;
  let tokens;
  try {
    tokens = yield import_spotify.Spotify.requestAuthTokens(code);
  } catch (error) {
    if (error instanceof import_spotify.FetchTokenError) {
      const { response } = error;
      server.log.error(response);
      return reply.status(response.status).send(response);
    }
    server.log.error(error);
    return reply.status(500).send();
  }
  try {
    yield import_spotify.Spotify.saveAuthTokens(userId, tokens);
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send();
  }
  return reply.header("Content-Type", "text/html").send(pages.callback);
}));
const startServer = () => __async(void 0, null, function* () {
  try {
    yield server.listen(process.env.PORT || 2422);
    console.log("Spotify Backend Client server started");
    console.log(server.server.address());
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startServer
});
