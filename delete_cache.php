<?php
// delete_cache.php
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) {
    echo "No existe la carpeta de cache.\n";
    exit(0);
}

$files = glob($cacheDir . '/*');
$count = 0;
foreach ($files as $file) {
    if (is_file($file)) {
        unlink($file);
        $count++;
    }
}
echo "Cache borrado. Archivos eliminados: $count\n";
