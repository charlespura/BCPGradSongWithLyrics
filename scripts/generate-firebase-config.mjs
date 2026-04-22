import fs from 'node:fs';
import path from 'node:path';

function parseDotEnvFile(contents) {
  const env = {};
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadEnv() {
  const env = { ...process.env };
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const fileEnv = parseDotEnvFile(fs.readFileSync(envPath, 'utf8'));
    for (const [key, value] of Object.entries(fileEnv)) {
      if (env[key] == null || env[key] === '') env[key] = value;
    }
  }
  return env;
}

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

const outPath = getArg('--out') ?? 'firebase-config.json';
const env = loadEnv();

const requiredKeys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

function writeConfigFile(filePath, firebaseConfig) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.js') {
    const js = `// Auto-generated. Do not commit.\nwindow.__FIREBASE_CONFIG__ = ${JSON.stringify(
      firebaseConfig,
      null,
      2,
    )};\n`;
    fs.writeFileSync(filePath, js, 'utf8');
  } else {
    fs.writeFileSync(
      filePath,
      JSON.stringify(firebaseConfig, null, 2) + '\n',
      'utf8',
    );
  }
}

const resolvedOutPath = path.resolve(process.cwd(), outPath);
const missing = requiredKeys.filter((key) => !env[key]);
if (missing.length) {
  console.warn(
    `Missing env vars: ${missing.join(
      ', ',
    )}\nWriting placeholder config to keep the site working (stars will be disabled).`,
  );
  writeConfigFile(resolvedOutPath, {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  console.log(`Wrote ${outPath}`);
} else {
  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };

  if (env.FIREBASE_MEASUREMENT_ID) {
    firebaseConfig.measurementId = env.FIREBASE_MEASUREMENT_ID;
  }

  writeConfigFile(resolvedOutPath, firebaseConfig);
  console.log(`Wrote ${outPath}`);
}
