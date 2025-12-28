<?php
require __DIR__ . '/../vendor/autoload.php';

use Illuminate\View\Engines\EngineResolver;
use Illuminate\View\Engines\CompilerEngine;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\View\FileViewFinder;
use Illuminate\View\Factory;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Events\Dispatcher;

$views = __DIR__ . '/../src/resources/views';
$cache = __DIR__ . '/../cache';
$logFile = __DIR__ . '/../error.log';

if (!is_dir($cache)) {
    mkdir($cache, 0755, true);
}

set_exception_handler(function ($e) use ($logFile) {
    $message = '[' . date('Y-m-d H:i:s') . "] ";
    $message .= $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "\n";
    $message .= $e->getTraceAsString() . "\n\n";
    file_put_contents($logFile, $message, FILE_APPEND);
    http_response_code(500);
    echo "<h1>Error 500</h1><p>Ocurrió un error interno. Revisa el archivo error.log para más detalles.</p>";
    exit;
});

try {
    $filesystem = new Filesystem();
    $bladeCompiler = new BladeCompiler($filesystem, $cache);
    // Registrar directiva @vite personalizada
    $bladeCompiler->directive('vite', function ($expression) {
        return "<?php echo '<link rel=\"stylesheet\" href=\"/build/app.css\">\n<script src=\"/build/app.js\"></script>'; ?>";
    });
    $resolver = new EngineResolver();
    $resolver->register('blade', function () use ($bladeCompiler) {
        return new CompilerEngine($bladeCompiler);
    });
    $finder = new FileViewFinder($filesystem, [$views]);
    $events = new Dispatcher();
    $factory = new Factory($resolver, $finder, $events);
    $factory->addExtension('blade.php', 'blade');

    // Puedes pasar variables a la vista aquí
    $lang = 'es';
    echo $factory->make('pages.home', ['lang' => $lang])->render();
} catch (Throwable $e) {
    throw $e;
}
?>
