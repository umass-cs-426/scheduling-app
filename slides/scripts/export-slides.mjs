import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function getBranchName() {
  const raw = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (!raw) return 'unknown-branch';
  return raw
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-+)|(-+$)/g, '') || 'unknown-branch';
}

const repoRoot = resolve(process.cwd());
const slidesDir = resolve(repoRoot, 'slides');

if (!existsSync(slidesDir)) {
  console.error('Expected slides directory at:', slidesDir);
  process.exit(1);
}

const branch = getBranchName();
const outputPath = resolve(slidesDir, `${branch}.pdf`);

run(`npm --prefix ./slides run export -- --output "${outputPath}"`);
