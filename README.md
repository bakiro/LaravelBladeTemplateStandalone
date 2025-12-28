# Laravel Blade Template Standalone

An advanced environment to design, preview, and validate Blade templates outside of Laravel, with maximum compatibility and portability for seamless migration to real Laravel projects.

## Main Structure
- `public/` — Entry point (`index.php`), compiled assets (`build/`)
- `src/resources/views/` — Blade views (`.blade.php`)
- `src/resources/js/` and `src/resources/css/` — Source files for assets
- `cache/` — Blade cache

## Usage

1. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Build assets**
   ```bash
   npm run build
   ```
   The generated files will be in `public/build/`.

3. **Preview the template**
   - Use Valet, PHP built-in server, or Apache/Nginx pointing to the `public/` folder.
   - Example with PHP:
     ```bash
     php -S localhost:8000 -t public
     ```

4. **Recommended development workflow**
   - Use the following command for live reload and automatic asset compilation:
     ```bash
     npm run dev:full
     ```
   - This command:
     - Starts the PHP server in public
     - Starts BrowserSync for live reload on Blade, JS, or CSS changes
     - Watches JS/CSS changes and automatically builds assets
     - Stops all processes with Ctrl+C
   - Lint and format commands (JS, CSS, PHP/Blade) must be run manually as needed:
     - `npm run lint:js`, `npm run format:js`, `npm run lint:css`, `npm run format:css`, `npm run lint:php`, `npm run fix:php`, `npm run phpstan`
   - No other development commands are needed; this covers the full workflow.

## Image and Font Handling

Place images and fonts in `src/resources/images` and `src/resources/fonts` respectively.

- To copy these files to `public/images` and `public/fonts` (without compiling or transforming), run:
  ```bash
  npm run copy:assets
  ```
- You can also use automatic watchers:
  - `npm run copy:images` (watches and copies images on change)
  - `npm run copy:fonts` (watches and copies fonts on change)

This makes migration to Laravel easy: just move the source files to `resources/images` and `resources/fonts` in the framework, without relying on compiled files from this project.

## PHP and Blade Syntax Validation

Validate your PHP and Blade files with:

- `npm run lint:php` — Syntax and style check with PHP_CodeSniffer.
- `npm run fix:php` — Auto-fix style errors.
- `npm run phpstan` — Analyze PHP code with PHPStan for errors and bad practices.

This helps maintain code quality and portability for Laravel projects.

## CSS Compatibility

Autoprefixer and PostCSS are integrated with Vite. When you build your CSS (`npm run build` or `npm run dev:full`), necessary cross-browser prefixes are added automatically. No extra configuration needed.

## Blade Directives Not Supported Outside Laravel

Some Blade directives depend on helpers, routes, authentication, or Laravel services and will not work in this standalone environment. Common examples:

| Directive         | Supported here? | Notes |
|-------------------|:---------------:|-------|
| @csrf, @method, @error, @enderror | ❌ | Depend on form and validation helpers |
| @auth, @guest, @can, @cannot      | ❌ | Depend on authentication/authorization |
| @inject, @env, @production, @push, @stack, @vite | ❌ | Depend on services, environment, or Laravel assets |
| @route, @url, @asset              | ❌ | Depend on route/asset helpers |
| @lang, @json, @dd, @dump          | ❌ | Depend on translation/debug helpers |
| @section, @yield, @include        | ✅ | Work for view structure |
| @php, @endphp, @switch, @case, @break, @continue, @default, @isset, @empty, @unless | ✅ | Work (Blade/PHP syntax) |

**Recommendation:**
If your template uses these directives, comment or clearly document which lines should be restored when migrating to Laravel. You can emulate some directives with variables or custom directives if needed.

## Example Output

When running `npm run dev:full` you should see something like:

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

When you save changes to Blade, JS, or CSS files, the browser will reload automatically and assets will be rebuilt.

## Troubleshooting

- If a process does not start, make sure PHP, Node.js, and npm are installed correctly.
- If the browser does not reload, check that BrowserSync is running and there are no port conflicts.
- If assets are not updating, ensure chokidar-cli is installed and the paths in dev.js match your structure.
- On Windows, if you have command issues, make sure npx is available and use compatible terminals.

## Laravel Compatibility
- Layout and views are ready to work in Laravel with minimal changes.
- The custom `@vite` directive is used for assets; replace it with Laravel's native directive when migrating.
- The `<html lang>` attribute uses a `$lang` variable from PHP; in Laravel, restore the original line with `app()->getLocale()`.
- Laravel helpers are not available outside the framework, but alternatives or documentation are provided.

## Notes
- Asset build does not require `vite-plugin-laravel`.
- The cache system can be cleaned with `php delete_cache.php`.
- When migrating to Laravel, check layout comments to restore native helpers and directives.

---

**Developed for maximum portability between standalone and Laravel environments.**
