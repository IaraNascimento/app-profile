const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

const config = {
  production: process.env.NG_APP_PRODUCTION === "true",
  firebase: {
    apiKey: process.env.NG_APP_FIREBASE_API_KEY,
    authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NG_APP_FIREBASE_APP_ID,
    measurementId: process.env.NG_APP_FIREBASE_MEASUREMENT_ID,
  },
};

const output = `export const environment = ${JSON.stringify(config, null, 2)};`;

fs.writeFileSync(path.resolve("src/environments/environment.ts"), output);

console.log("Environment generated");
