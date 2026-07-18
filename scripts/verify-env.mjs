import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), '.env.local');

  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [name, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();

    if (name && process.env[name] === undefined) {
      process.env[name] = value;
    }
  }
}

loadLocalEnv();

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
];

const optional = ['NEXT_PUBLIC_APP_NAME', 'SUPABASE_SERVICE_ROLE_KEY'];

const missing = required.filter((name) => !process.env[name]?.trim());
const warnings = optional.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  for (const name of missing) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('Optional environment variables not set:');
  for (const name of warnings) {
    console.warn(`- ${name}`);
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (url?.includes('/rest/v1')) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL must be the project URL, without /rest/v1.'
  );
  process.exit(1);
}

console.log('Deployment environment check passed.');
