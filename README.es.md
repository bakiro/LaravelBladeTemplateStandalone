# Laravel Blade Template Standalone

Un entorno avanzado para diseñar, previsualizar y validar templates Blade fuera de Laravel, con máxima compatibilidad y portabilidad para migrar a proyectos Laravel reales.
## Directivas Blade no soportadas fuera de Laravel

Algunas directivas de Blade dependen de helpers, rutas, autenticación o servicios internos de Laravel y no funcionarán en este entorno standalone. Entre las más comunes:

| Directiva         | ¿Funciona aquí? | Notas |
|-------------------|:---------------:|-------|
| @csrf, @method, @error, @enderror | ❌ | Dependen de helpers de formularios y validación |
| @auth, @guest, @can, @cannot      | ❌ | Dependen de autenticación/autorización |
| @inject, @env, @production, @push, @stack, @vite | ❌ | Dependen de servicios, entorno o assets de Laravel |
| @route, @url, @asset              | ❌ | Dependen de helpers de rutas/assets |
| @lang, @json, @dd, @dump          | ❌ | Dependen de helpers de traducción/debug |
| @section, @yield, @include        | ✅ | Funcionan para estructura de vistas |
| @php, @endphp, @switch, @case, @break, @continue, @default, @isset, @empty, @unless | ✅ | Funcionan (sintaxis Blade/PHP) |

**Recomendación:**
Si tu template usará estas directivas, coméntalas o documenta claramente qué líneas deben restaurarse al migrar a Laravel. Puedes emular algunas directivas con variables o directivas personalizadas si lo necesitas.
## Manejo de imágenes y fuentes

Las imágenes y fuentes deben colocarse en `src/resources/images` y `src/resources/fonts` respectivamente.

- Para copiar estos archivos a `public/images` y `public/fonts` (sin compilar ni transformar), ejecuta:
   ```bash
   npm run copy:assets
   ```
- También puedes usar watchers automáticos:
   - `npm run copy:images` (observa y copia imágenes al cambiar)
   - `npm run copy:fonts` (observa y copia fuentes al cambiar)

Esto facilita la migración a Laravel, ya que solo debes mover los archivos fuente a `resources/images` y `resources/fonts` en el framework, sin depender de los compilados de este proyecto.
## Validación de sintaxis PHP y Blade

Puedes validar la sintaxis y el estilo de tus archivos PHP y Blade con los siguientes comandos:

- `npm run lint:php` — Analiza sintaxis y estilo con PHP_CodeSniffer.
- `npm run fix:php` — Intenta corregir errores de estilo automáticamente.
- `npm run phpstan` — Analiza código PHP con PHPStan para encontrar errores y malas prácticas.

Esto ayuda a mantener la calidad y portabilidad del código para proyectos Laravel.
## Compatibilidad CSS

El proyecto incluye Autoprefixer y PostCSS integrados en el flujo de Vite. Al compilar tus archivos CSS (con `npm run build` o `npm run dev:full`), los prefijos necesarios para compatibilidad cross-browser se agregan automáticamente. No necesitas configuración adicional.
## Ejemplo visual

Al ejecutar `npm run dev:full` deberías ver en consola algo similar a:

```
> template@1.0.0 dev:full
> node dev.js

[Browsersync] Proxying: http://localhost:8000
[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.x.x:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.x.x:3001
 --------------------------------------
[Browsersync] Watching files...
PHP built-in server started at http://localhost:8000
...
```

Al guardar cambios en archivos Blade, JS o CSS, el navegador se recargará automáticamente y los assets se recompilarán.

## Troubleshooting

- Si algún proceso no inicia, asegúrate de tener PHP, Node.js y npm instalados correctamente.
- Si el navegador no recarga, revisa que BrowserSync esté corriendo y que no haya conflictos de puertos.
- Si los assets no se actualizan, verifica que chokidar-cli esté instalado y que los paths en dev.js coincidan con tu estructura.
- Si usas Windows y tienes problemas con los comandos, asegúrate de tener npx disponible y usa terminales compatibles.
# Laravel-like Blade Template Standalone

Este proyecto permite desarrollar y previsualizar templates Blade fuera de un proyecto Laravel, emulando la estructura y helpers más comunes para facilitar su futura integración en Laravel.

## Estructura principal
- `public/` — Punto de entrada (`index.php`), assets compilados (`build/`)
- `src/resources/views/` — Vistas Blade (`.blade.php`)
- `src/resources/js/` y `src/resources/css/` — Archivos fuente para assets
- `cache/` — Caché de Blade

## Uso

1. **Instalación de dependencias**
   ```bash
   composer install
   npm install
   ```

2. **Compilar assets**
   ```bash
   npm run build
   ```
   Los archivos generados estarán en `public/build/`.

3. **Visualizar el template**
   - Usa Valet, PHP built-in server o Apache/Nginx apuntando a la carpeta `public/`.
   - Ejemplo con PHP:
     ```bash
     php -S localhost:8000 -t public
     ```




4. **Flujo de desarrollo recomendado**
    - Usa el siguiente comando para desarrollo con recarga automática de navegador y recompilación de assets:
       ```bash
       npm run dev:full
       ```
    - Este comando:
       - Inicia el servidor PHP en public
       - Inicia BrowserSync para recarga automática al editar Blade, JS o CSS
       - Observa cambios en JS/CSS y ejecuta automáticamente la compilación de assets
       - Al presionar Ctrl+C, todos los procesos se detienen correctamente
    - Los comandos de lint y format (JS, CSS, PHP/Blade) deben ejecutarse manualmente cuando lo desees:
       - `npm run lint:js`, `npm run format:js`, `npm run lint:css`, `npm run format:css`, `npm run lint:php`, `npm run fix:php`, `npm run phpstan`
    - No es necesario usar otros comandos de desarrollo, este flujo cubre todo el ciclo de trabajo.

## Compatibilidad con Laravel
- El layout y las vistas están preparados para funcionar en Laravel sin cambios mayores.
- Se usa la directiva personalizada `@vite` para incluir assets, que puedes reemplazar por la nativa de Laravel al migrar.
- El atributo `lang` en `<html>` usa una variable `$lang` pasada desde PHP; en Laravel puedes restaurar la línea original con `app()->getLocale()`.
- Helpers de Laravel no están disponibles fuera del framework, pero se emulan o documentan alternativas.

## Notas
- El build de assets no requiere `vite-plugin-laravel`.
- El sistema de caché puede limpiarse con `php delete_cache.php`.
- Si migras a Laravel, revisa los comentarios en los layouts para restaurar helpers y directivas nativas.

---

**Desarrollado para máxima portabilidad entre entornos standalone y Laravel.**
