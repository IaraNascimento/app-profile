const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
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

const outputPath = path.resolve(
  process.cwd(),
  "src/environments/environment.ts",
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);

console.log("Environment generated:", outputPath);
