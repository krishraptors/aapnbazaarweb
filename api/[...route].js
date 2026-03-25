import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const app = require('../server/app');
const connectDB = require('../server/config/db');
const { setStorageMode } = require('../server/config/storage');

let initPromise;

const initialize = async () => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const fallbackMode = process.env.GOLAMART_STORAGE_MODE || 'file';
    let storageMode = fallbackMode;

    if (process.env.MONGO_URI) {
      try {
        await connectDB();
        storageMode = 'mongo';
      } catch (error) {
        if (fallbackMode !== 'file') {
          throw error;
        }

        console.warn('MongoDB unavailable, falling back to file storage.');
      }
    } else if (process.env.VERCEL) {
      console.warn('MONGO_URI not set on Vercel. GolaMart is using temporary file storage.');
    }

    setStorageMode(storageMode);
    app.locals.storageMode = storageMode;
  })();

  return initPromise;
};

export default async function handler(req, res) {
  await initialize();
  return app(req, res);
}
