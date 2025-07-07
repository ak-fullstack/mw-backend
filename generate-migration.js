const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const defaultName = 'AutoMigration';

rl.question(`Enter migration name (default: ${defaultName}): `, function(name) {
  const migrationName = name.trim() || defaultName;

  const args = [
    '-r',
    'tsconfig-paths/register',
    './node_modules/typeorm/cli.js',
    'migration:generate',
    '-d',
    'src/data-source.ts',
    `src/migrations/${migrationName}`,
    '--pretty'
  ];

  // This will stream everything directly to the console
  const child = spawn('ts-node', args, {
    stdio: 'inherit', // ⬅️ pipes input/output/error directly
    shell: true       // ⬅️ for Windows compatibility
  });

  child.on('exit', () => rl.close());
});
