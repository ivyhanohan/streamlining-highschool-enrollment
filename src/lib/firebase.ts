
// Mock Firebase functions to prevent errors in pages that still use them

// Create mock versions of Firebase document functions
const createMockDoc = (data = null) => ({
  exists: data !== null,
  data: () => data
});

// Mock Firebase auth functionality
export const auth = {
  signInWithEmailAndPassword: () => Promise.resolve(null),
  createUserWithEmailAndPassword: () => Promise.resolve(null),
  signOut: () => Promise.resolve(null),
  onAuthStateChanged: () => () => {}, // Return unsubscribe function
};

// Mock Firestore document/collection references
export const doc = (db: any, collection: string, id: string) => {
  return {
    get: () => Promise.resolve(createMockDoc()),
    set: (data: any) => {
      try {
        // Store data in localStorage as fallback
        const key = `${collection}-${id}`;
        localStorage.setItem(key, JSON.stringify(data));
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    update: (data: any) => Promise.resolve()
  };
};

export const getDoc = async (docRef: any) => {
  if (docRef && docRef.get) {
    return docRef.get();
  }
  return createMockDoc();
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  if (docRef && docRef.set) {
    return docRef.set(data, options);
  }
  return Promise.resolve();
};

export const addDoc = async (collectionRef: any, data: any) => {
  const id = `doc-${Date.now()}`;
  return { id };
};

export const collection = (db: any, collectionName: string) => {
  return {
    doc: (id: string) => doc(db, collectionName, id),
    add: (data: any) => {
      const id = `doc-${Date.now()}`;
      return Promise.resolve({ id });
    }
  };
};

// Mock Firestore database
export const db = {
  collection: (name: string) => ({
    add: (data: any) => Promise.resolve({ id: `mock-${Date.now()}` }),
    doc: (id: string) => ({
      get: () => Promise.resolve(createMockDoc()),
      set: (data: any) => Promise.resolve(),
      update: (data: any) => Promise.resolve(),
    }),
    where: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
};

export const app = {};
