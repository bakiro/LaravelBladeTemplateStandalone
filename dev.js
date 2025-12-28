
// Asegura que public/build existe y tiene los archivos iniciales para @vite fake
const fs = require('fs');
const { execSync, spawn } = require('child_process');
if (!fs.existsSync('public/build')) {
  console.log('[dev.js] public/build no existe, ejecutando primer build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.error('[dev.js] Error al ejecutar el build inicial:', e.message);
  }
}

// Helper para lanzar procesos solo si la carpeta existe
function safeSpawn(desc, cmd, args) {
  if (args.some(arg => arg.includes('images')) && !fs.existsSync('src/resources/images')) {
    console.log('[dev.js] Carpeta src/resources/images no existe, watcher omitido.');
    return null;
  }
  if (args.some(arg => arg.includes('fonts')) && !fs.existsSync('src/resources/fonts')) {
    console.log('[dev.js] Carpeta src/resources/fonts no existe, watcher omitido.');
    return null;
  }
  try {
    const proc = spawn(cmd, args, { stdio: 'inherit' });
    proc.on('error', err => {
      console.error(`[dev.js] Error en proceso ${desc}:`, err.message);
    });
    return proc;
  } catch (e) {
    console.error(`[dev.js] No se pudo iniciar ${desc}:`, e.message);
    return null;
  }
}

// Inicia el servidor PHP embebido apuntando a la carpeta public
const php = safeSpawn('php', 'php', ['-S', 'localhost:8000', '-t', 'public']);

// Inicia BrowserSync para recarga automática del navegador
const browsersync = safeSpawn('browsersync', process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'browsersync']);

// Observa cambios en JS/CSS y ejecuta build automático de assets
const chokidarBuild = safeSpawn(
  'chokidar build',
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  [
    'chokidar',
    'src/resources/js/**/*.js',
    'src/resources/css/**/*.css',
    '-c',
    'npm run build'
  ]
);

// Observa cambios en imágenes y copia automáticamente a public/images
const chokidarImages = safeSpawn(
  'chokidar images',
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  [
    'chokidar',
    'src/resources/images/**/*',
    '-c',
    'npm run copy:images:once'
  ]
);

// Observa cambios en fuentes y copia automáticamente a public/fonts
const chokidarFonts = safeSpawn(
  'chokidar fonts',
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  [
    'chokidar',
    'src/resources/fonts/**/*',
    '-c',
    'npm run copy:fonts:once'
  ]
);

function cleanup() {
  [php, browsersync, chokidarBuild, chokidarImages, chokidarFonts].forEach(proc => {
    if (proc && !proc.killed) proc.kill();
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

[php, browsersync, chokidarBuild, chokidarImages, chokidarFonts].forEach(proc => {
  if (proc) proc.on('exit', cleanup);
});
