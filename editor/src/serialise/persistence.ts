import Creation from './creation';
import { groupToJSONString } from './serialiser';

const DB_NAME = 'user-content';
const CREATION_STORE_NAME = 'creations';
const WORLD_STORE_NAME = 'worlds';

// Open DB
const dbPromise = window.indexedDB.open(DB_NAME, 1);
let db: IDBDatabase;

// Create IndexedDB object stores if needed in callback
dbPromise.onupgradeneeded = () => {
  db = dbPromise.result;

  // Create object stores if not present
  if (!db.objectStoreNames.contains(CREATION_STORE_NAME)) {
    const creationStore = db.createObjectStore(CREATION_STORE_NAME, { keyPath: 'name' });
    creationStore.createIndex('description', 'description');
  }
  if (!db.objectStoreNames.contains(WORLD_STORE_NAME)) {
    const worldStore = db.createObjectStore(WORLD_STORE_NAME, { keyPath: 'name' });
    worldStore.createIndex('description', 'description');
  }
};

dbPromise.onerror = () => {
  throw new Error('Could not open database');
};

dbPromise.onsuccess = () => {
  db = dbPromise.result;
};

/**
 * Stores the creation in the database.
 *
 * @param {Creation} creation The creation to be stored
 */
export function storeCreation(creation: Creation) {
  const objectToStore = {
    name: creation.name,
    description: creation.description,
    thumbnail: creation.thumbnail,
    content: groupToJSONString(creation.content),
  };
  const tx = db.transaction(CREATION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(CREATION_STORE_NAME);
  const request = store.put(objectToStore);

  request.onerror = () => {
    console.log('storing failed');
  };

  request.onsuccess = () => {
    console.log('storing completed');
  };
}

/**
 * Returns an array containing the names of the stored creations.
 *
 * @returns {Promise<string[]>} The names of the stores creations
 */
export function getStoredCreationNames() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CREATION_STORE_NAME, 'readonly');
    const store = tx.objectStore(CREATION_STORE_NAME);
    const index = store.index('name');
    const request = index.getAllKeys();
    request.onerror = () => {
      reject(new Error(`The names could not be retrieved from the database: ${request.error}`));
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * Retrieves a creation from the database.
 *
 * @param {string} name The name of the creation to be retrieved
 * @returns {Promise<{
 *  name: string,
 *  description: string,
 *  thumbnail: string,
 *  content: string
 * }>} The creation in it's stored format
 */
export function getSerialisedCreation(name: string):Promise<{
  name: string,
  description: string,
  thumbnail: string,
  content: string
}> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CREATION_STORE_NAME, 'readwrite');
    const store = tx.objectStore(CREATION_STORE_NAME);
    const index = store.index('name');
    const request = index.get(name);
    request.onerror = () => {
      reject(new Error(`The creation could not be retrieved from the database: ${request.error}`));
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}
