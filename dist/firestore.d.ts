export declare class Firestore {
    static collectionReference(): import("firebase/firestore").CollectionReference<import("firebase/firestore").DocumentData>;
    static documentReference(documentId: string): import("firebase/firestore").DocumentReference<import("firebase/firestore").DocumentData>;
    static getDocument<T>(documentId: string): Promise<T>;
    static setDocument<T>(documentId: string, data: unknown): Promise<T>;
    static updateDocument<T>(documentId: string, data: Partial<unknown>): Promise<T>;
}
//# sourceMappingURL=firestore.d.ts.map