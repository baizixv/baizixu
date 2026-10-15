import { readFile } from 'node:fs/promises';

/**
 * 版本一致性检查：package.json 的 version 必须等于版本说明里最新一条。
 * 发布时两处一起改，构建会自动拦住漏改。
 */
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const about = await readFile('src/data/about.ts', 'utf8');
const match = about.match(/releases:\s*\[\s*\{\s*version:\s*'v([0-9]+\.[0-9]+\.[0-9]+)'/);

if (!match) {
  console.error('Version check failed: no release entry found in src/data/about.ts');
  process.exit(1);
}

if (match[1] !== pkg.version) {
  console.error(
    `Version mismatch:\n  package.json:  ${pkg.version}\n  changelog top: ${match[1]}\n` +
      'Bump package.json and add a matching release entry in src/data/about.ts.',
  );
  process.exit(1);
}

console.log(`Version check passed: ${pkg.version}`);
