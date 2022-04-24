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
var firestore_exports = {};
__export(firestore_exports, {
  Firestore: () => Firestore
});
module.exports = __toCommonJS(firestore_exports);
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
var import_config = require("./config");
const firebase = (0, import_app.initializeApp)({
  apiKey: import_config.Config.FIREBASE_API_KEY,
  authDomain: import_config.Config.FIREBASE_AUTH_DOMAIN,
  projectId: import_config.Config.FIREBASE_PROJECT_ID
});
const firestore = (0, import_firestore.getFirestore)(firebase);
const collectionId = "spotify-backend-client";
class Firestore {
  static collectionReference() {
    return (0, import_firestore.collection)(firestore, collectionId);
  }
  static documentReference(documentId) {
    return (0, import_firestore.doc)(firestore, collectionId, documentId);
  }
  static getDocument(documentId) {
    return __async(this, null, function* () {
      const document = Firestore.documentReference(documentId);
      const doc2 = yield (0, import_firestore.getDoc)(document);
      return doc2.data();
    });
  }
  static setDocument(documentId, data) {
    return __async(this, null, function* () {
      yield (0, import_firestore.setDoc)(Firestore.documentReference(documentId), data);
      return Firestore.getDocument(documentId);
    });
  }
  static updateDocument(documentId, data) {
    return __async(this, null, function* () {
      yield (0, import_firestore.setDoc)(Firestore.documentReference(documentId), data, { merge: true });
      return Firestore.getDocument(documentId);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Firestore
});
