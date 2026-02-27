const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const ROOT = __dirname;
const EXPRESS_DIR = path.join(ROOT, 'express-server');
const NEXT_DIR = path.join(ROOT, 'nextjs-client');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

function fileExists(p) {
  return fs.existsSync(p);
}

async function main() {
  log('\n========================================', 'cyan');
  log('  Travel Routes Afeka 2026 - Initial Setup', 'bold');
  log('========================================\n', 'cyan');

  // Step 1: Install dependencies
  log('[1/3] Installing packages...', 'yellow');

  if (!fileExists(path.join(ROOT, 'node_modules'))) {
    log('  -> Installing root packages...', 'cyan');
    execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
  }

  if (!fileExists(path.join(EXPRESS_DIR, 'node_modules'))) {
    log('  -> Installing Express server packages...', 'cyan');
    execSync('npm install', { cwd: EXPRESS_DIR, stdio: 'inherit' });
  } else {
    log('  -> Express server - packages already installed ✓', 'green');
  }

  if (!fileExists(path.join(NEXT_DIR, 'node_modules'))) {
    log('  -> Installing Next.js packages...', 'cyan');
    execSync('npm install', { cwd: NEXT_DIR, stdio: 'inherit' });
  } else {
    log('  -> Next.js - packages already installed ✓', 'green');
  }

  // Step 2: Configure .env files
  log('\n[2/3] Configuring environment variables...', 'yellow');

  const expressEnvPath = path.join(EXPRESS_DIR, '.env');
  const nextEnvPath = path.join(NEXT_DIR, '.env.local');

  if (fileExists(expressEnvPath) && fileExists(nextEnvPath)) {
    log('  -> .env files already exist ✓', 'green');
    const overwrite = await ask('  -> Overwrite them? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log('  -> Skipping .env configuration', 'cyan');
      finishSetup();
      return;
    }
  }

  log('\n  Enter your API keys (press Enter to skip a field):\n', 'cyan');

  const groqKey = await ask('  Groq API Key (gsk_...) [חינמי]: ');
  const unsplashKey = await ask('  Unsplash Access Key (אופציונלי - לתמונות): ');
  const weatherKey = await ask('  OpenWeatherMap API Key: ');
  const orsKey = await ask('  OpenRouteService API Key: ');
  const mongoUri = await ask('  MongoDB URI (Enter = localhost): ');

  const jwtSecret = generateSecret();
  const jwtRefreshSecret = generateSecret();
  const mongo = mongoUri.trim() || 'mongodb://localhost:27017/travel-routes';

  const expressEnv = `PORT=4000
MONGODB_URI=${mongo}
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
CLIENT_URL=http://localhost:3000
`;

  const nextEnv = `NEXT_PUBLIC_EXPRESS_URL=http://localhost:4000
MONGODB_URI=${mongo}
JWT_SECRET=${jwtSecret}
GROQ_API_KEY=${groqKey.trim()}
UNSPLASH_ACCESS_KEY=${unsplashKey.trim()}
OPENWEATHER_API_KEY=${weatherKey.trim()}
ORS_API_KEY=${orsKey.trim()}
`;

  fs.writeFileSync(expressEnvPath, expressEnv);
  fs.writeFileSync(nextEnvPath, nextEnv);
  log('  -> .env files created successfully ✓', 'green');

  finishSetup();

  function finishSetup() {
    log('\n[3/3] Summary', 'yellow');
    log('========================================', 'cyan');
    log('  Setup completed successfully! 🎉', 'green');
    log('========================================', 'cyan');
    log('\n  To run the project:', 'bold');
    log('    npm run dev', 'cyan');
    log('\n  Or double-click:', 'bold');
    log('    start.bat', 'cyan');
    log('\n  The app will be available at:', 'bold');
    log('    http://localhost:3000', 'cyan');
    log('\n  Make sure MongoDB is running before starting!\n', 'red');
    rl.close();
  }
}

function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  rl.close();
  process.exit(1);
});
