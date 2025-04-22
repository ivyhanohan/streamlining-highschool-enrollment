
// This is a placeholder file to prevent import errors
// Firebase functionality has been removed and replaced with localStorage storage

export const auth = {
  // Placeholder methods to prevent errors in case any components still reference them
  signInWithEmailAndPassword: () => Promise.resolve(null),
  createUserWithEmailAndPassword: () => Promise.resolve(null),
  signOut: () => Promise.resolve(null),
  onAuthStateChanged: () => () => {}, // Return unsubscribe function
};

export const db = {
  collection: () => ({
    add: () => Promise.resolve({ id: 'mock-id' }),
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
    }),
    where: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
};

export const app = {};
