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
  log('  מסלול טיולים אפקה 2026 - הגדרה ראשונית', 'bold');
  log('========================================\n', 'cyan');

  // Step 1: Install dependencies
  log('[1/3] התקנת חבילות...', 'yellow');

  if (!fileExists(path.join(ROOT, 'node_modules'))) {
    log('  -> מתקין חבילות root...', 'cyan');
    execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
  }

  if (!fileExists(path.join(EXPRESS_DIR, 'node_modules'))) {
    log('  -> מתקין חבילות Express server...', 'cyan');
    execSync('npm install', { cwd: EXPRESS_DIR, stdio: 'inherit' });
  } else {
    log('  -> Express server - חבילות כבר מותקנות ✓', 'green');
  }

  if (!fileExists(path.join(NEXT_DIR, 'node_modules'))) {
    log('  -> מתקין חבילות Next.js...', 'cyan');
    execSync('npm install', { cwd: NEXT_DIR, stdio: 'inherit' });
  } else {
    log('  -> Next.js - חבילות כבר מותקנות ✓', 'green');
  }

  // Step 2: Configure .env files
  log('\n[2/3] הגדרת משתני סביבה...', 'yellow');

  const expressEnvPath = path.join(EXPRESS_DIR, '.env');
  const nextEnvPath = path.join(NEXT_DIR, '.env.local');

  if (fileExists(expressEnvPath) && fileExists(nextEnvPath)) {
    log('  -> קבצי .env כבר קיימים ✓', 'green');
    const overwrite = await ask('  -> האם לדרוס אותם? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log('  -> דילוג על הגדרת .env', 'cyan');
      finishSetup();
      return;
    }
  }

  log('\n  הכנס את מפתחות ה-API שלך (Enter לדלג על שדה):\n', 'cyan');

  const openaiKey = await ask('  OpenAI API Key (sk-...): ');
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
OPENAI_API_KEY=${openaiKey.trim()}
OPENWEATHER_API_KEY=${weatherKey.trim()}
ORS_API_KEY=${orsKey.trim()}
`;

  fs.writeFileSync(expressEnvPath, expressEnv);
  fs.writeFileSync(nextEnvPath, nextEnv);
  log('  -> קבצי .env נוצרו בהצלחה ✓', 'green');

  finishSetup();

  function finishSetup() {
    log('\n[3/3] סיכום', 'yellow');
    log('========================================', 'cyan');
    log('  ההגדרה הושלמה בהצלחה! 🎉', 'green');
    log('========================================', 'cyan');
    log('\n  להפעלת הפרויקט הרץ:', 'bold');
    log('    npm run dev', 'cyan');
    log('\n  או לחץ פעמיים על:', 'bold');
    log('    start.bat', 'cyan');
    log('\n  האתר יהיה זמין ב:', 'bold');
    log('    http://localhost:3000', 'cyan');
    log('\n  ודא ש-MongoDB פועל לפני ההפעלה!\n', 'red');
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
