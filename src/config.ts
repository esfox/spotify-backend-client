export const Config = {
  ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  SPOTIFY_CALLBACK_BASE_URL: process.env.SPOTIFY_CALLBACK_BASE_URL,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_SCOPES: process.env.SPOTIFY_SCOPES,

  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
};

/* Check environment variables */
if(Object.values(Config).some(variable => variable === undefined || variable === null))
  throw new Error('Please complete the necessary environment variables');
